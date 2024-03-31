const mongoose = require('mongoose');

const Task = new mongoose.Schema({
    title:{
        type:String
    },
    desc:{
        type:String
    },
    team:{
        type:String
    },
    assignees:{
        type:String
    },
    priority:{
        type:String
    },
    status:{
        type:String,
        default: 'assign'
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
    },
    
});


module.exports = mongoose.model('task', Task);