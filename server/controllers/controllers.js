const toDoList = require('../models/schema');

//This function is to send the TODO List back to the client whenever a get request is fired. We use exports to export the function or object
exports.sendList = (req,res)=> {
    toDoList.find((err,data)=>{
        res.json(data)
        if(err)
            res.json(err)
    })
}

//This function is to save a new task whenever a post request is fired by the client
exports.saveList = (req,res)=>{
    console.log(req.body)
   let item = new toDoList({
       title: req.body.title,
       task: req.body.task,
       priority: req.body.priority
    })
    item.save((err)=>{
        if(err)
            console.log(err)
        res.json("Data saved successfully");
    })
}
//This function is to edit a  task whenever a put request is fired by the client
exports.editList = (req,res) => {
    toDoList.findById(req.body._id, (err,data)=>{
        if(err){
            console.log(err)
            res.json(err)
        }
        data.title = req.body.title
        data.task = req.body.task
        data.priority =req.body.priority
        data.save();
        res.json("Data successfully saved");
    })
}

//This function is to delete a  task whenever a delete request is fired by the client
exports.deleteList = (req,res) => {
    toDoList.deleteOne({"_id":req.params.id }, (error,data) => {
        if (error) {
            console.log(error)
        }
        else{
            console.log(data)
            console.log(req.params.id)
            res.json("Deleted successfully")
        }
    })
};

