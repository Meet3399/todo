const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const routers = require('./routes/routes');

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.listen(port, (req,res)=> {
    console.log("Port is running on " , port);
})

app.use(routers)
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