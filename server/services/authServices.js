global.fetch = require('node-fetch');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt  = require('jsonwebtoken');
global.navigator = () => null;

const issuer = "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_X1JBEegHF";
const aud = "778sn7ks85dqbp0op5hjg81bt1"


const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const poolData = {
    UserPoolId: "ap-south-1_X1JBEegHF",
    ClientId: "778sn7ks85dqbp0op5hjg81bt1"
};
const pool_region = "ap-south-1";
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
exports.Register = function (body, callback) {
    var email = body.email;
    var password = body.password;
    var attributeList = [];

    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
    userPool.signUp(password, attributeList, null, function (err, result) {
        if (err)
            callback(err);
        var cognitoUser = result.user;
        callback(null, cognitoUser);
    })
}

exports.Login = function (body, callback) {
    var userName = body.name;
    var password = body.password;
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: userName,
        Password: password
    });
    var userData = {
        Username: userName,
        Pool: userPool
    }
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accesstoken = result.getAccessToken().getJwtToken();
            callback(null, accesstoken);
        },
        onFailure: (function (err) {
            callback(err);
        })
    })
};

exports.Validate = function (token, callback) {
    request({
        url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
        json: true
    }, function (error, response, body) {
        //console.log(error , response , body)
        if (!error && response.statusCode === 200) {
            pems = {};
            var keys = body['keys'];
            for (var i = 0; i < keys.length; i++) {
                var key_id = keys[i].kid;
                var modulus = keys[i].n;
                var exponent = keys[i].e;
                var key_type = keys[i].kty;
                var jwk = { kty: key_type, n: modulus, e: exponent };
                var pem = jwkToPem(jwk);
                pems[key_id] = pem;
            }
            //console.log(pems)
            //console.log(token.accessToken)
            var decodedJwt = jwt.decode(token.jwtToken, { complete: true });
           // console.log(decodedJwt)
            if (!decodedJwt) {
                console.log("Not a valid JWT token");
                callback(new Error('Not a valid JWT token'));
            }
            var kid = decodedJwt.header.kid;
            console.log(kid)
            var pem = pems[kid];
            console.log(pem)
            if (!pem) {
                console.log('Invalid token');
                callback(new Error('Invalid token'));
            }
            jwt.verify(token.jwtToken, pem, { issuer: token.payload.iss } ,function (err, payload) {
                if (err) {
                    console.log("Invalid Token in verification");
                    callback(new Error('Invalid token'));
                } else {
                    console.log("Valid Token.");
                    callback(null, "Valid token");
                }
            });
        } else {
            console.log("Error! Unable to download JWKs");
            callback(error);
        }
    });
}

