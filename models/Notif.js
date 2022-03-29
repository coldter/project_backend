const mongoose = require('mongoose');

const NotifSchema = mongoose.Schema({
    detail:{type:String,required:true}
    
});

module.exports = mongoose.model('Notif',NotifSchema);