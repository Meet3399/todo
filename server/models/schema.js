const mongoose = require('mongoose');


const toDOSchema = new mongoose.Schema({
    title: String,
    task: String,
    priority: String
})

const schema = module.exports = mongoose.model('TODOLIST', toDOSchema);