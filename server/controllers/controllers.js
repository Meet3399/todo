const toDoList = require('../models/schema');

exports.sendList = (req,res)=> {
    toDoList.find((err,data)=>{
        console.log(req.method + "Method arrived");
        res.json(data)
        if(err)
            res.json(err)
    })
}

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

