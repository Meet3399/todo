//Importing 3rd party modules
const express = require('express');   //Used for parsing the request and sending response back
const bodyParser = require('body-parser');  //Used for parsing the req data and appending it in an object called body
const cors = require('cors');       //Enables cors so that we can sen request from other origins
const mongoose = require('mongoose');  //Framework to talk with mongoose

const routers = require('./routes/routes');  //This is where we have define all our routes so we are importing it

const app = express();   //Creating an instance of our express module
const port = 8080;     //Port on which server will be running
 
app.use(cors());    //Using use method all the incoming request will use the object or function we define inside it. Here it will run the cors function on every request
app.use(bodyParser.json());  //It parses only json data which is provided in the request
app.use(bodyParser.urlencoded({extended: true})) // It parses from data

//Creating our server
app.listen(port, (req,res)=> {
    console.log("Port is running on " , port);
})

app.use(routers)   // Using the routers function to find the route

//Connection with mongob
mongoose.connect("mongodb://localhost:27017", {useNewUrlParser: true , useUnifiedTopology: true})

mongoose.connection.on('connected', (error)=>{
    console.log("Database Connected")
    if(error){
        console.log("Some error happened", error)
    }
})
mongoose.connection.on('error', (error) => {
        console.log("Some error happened", error)
})