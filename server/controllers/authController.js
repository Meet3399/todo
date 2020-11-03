const authService = require('../services/authServices');

 global.fetch = require('node-fetch');
 global.navigator = () => null;
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
    UserPoolId: "ap-south-1_X1JBEegHF",
    ClientId: "778sn7ks85dqbp0op5hjg81bt1"
};
const pool_region = "ap-south-1";

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

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

exports.login = function (req, res) {
    const loginDetails = {
        Username: req.body.email,
        Password: req.body.password 
    }

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(loginDetails);
    const userDetail = {
        Username: req.body.email,
        Pool: userPool
    }
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetail);
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

exports.validate_token = function (req, res , next) {
    //console.log(req.body.token)
    if(!req.body.token){
        res.status(401).send("Invalid authorization");
    }
    authService.Validate(req.body.token, function (err, result) {
        console.log(err,result)
        if (err){
        res.send(err);}
        else{
            next();
        }
    })
}