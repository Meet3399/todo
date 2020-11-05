const authService = require('../services/authServices');

global.fetch = require('node-fetch');   //This module is used as while validating as aws cognito also need to send a request to get the keys
global.navigator = () => null;
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');   //aws cognito package for integrating node wih aws cognito

//This is the pool data we need to pass to create a userPool.
const poolData = {
    UserPoolId: "ap-south-1_X1JBEegHF",
    ClientId: "778sn7ks85dqbp0op5hjg81bt1"
};
const pool_region = "ap-south-1";

//Creating a new userPool so that node can communicate with the aws cognito.
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


//SignUp or Register function
exports.register = function (req, res) {
        var email = {
            Name: 'email',
            Value: req.body.email,
        };

        const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(email);
        userPool.signUp(req.body.email,req.body.password , [ emailAttribute] , null ,  (err,data)=>{
            if(err){
                console.log(err)
                res.send(err)
            }
            else{
                res.json(data.user);
                console.log(data.user);
            }
        })
}

//Login
exports.login = function (req, res) {
    //getting the user email and it's password
    const loginDetails = {
        Username: req.body.email,
        Password: req.body.password 
    }
    //creating authentication details from the given mail and password
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(loginDetails);
    const userDetail = {
        Username: req.body.email,
        Pool: userPool
    }
    //creating a cognito user
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetail);
    
    //Authenticating the user by passing the authentication details an what to do on success and failure functions
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: data=>{  
            //console.log(data)
            res.json(data)
        },
        onFailure: data =>{
            //console.log(data)
            res.json(data);
        }
    })
}


//Valiating the token once user has logged in so he can access protected resources
exports.validate_token = function (req, res , next) {
    //If no token is present send a error back to client
    if(!req.body.token){
        res.status(401).send("Invalid authorization");
    }
    //Calling the validate function that will send us the error or result. If there's no error we go to the next middleware function by calling next() function
    Validate(req.body.token, function (err, result) {
        console.log(err,result)
        if (err){
        res.send(err);}
        else{
            next();
        }
    })
}

const Validate = function (token, callback) {
    //Requesting aws cognito to give us the keys to verify the jwt
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
            //Validating the jwt tokens
            var decodedJwt = jwt.decode(token.jwtToken, { complete: true });
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
            jwt.verify(token.jwtToken, pem, { issuer: token.payload.iss }, function (err, payload) {
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
