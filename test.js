var mongoose = require('mongoose');

api = "mongodb+srv://the_phinisher:ApXGIHpwdmVnYkr8@cluster0.rtbberh.mongodb.net/?retryWrites=true&w=majority";


var bdaySchema = new mongoose.Schema({
    name:String,
    bday:Date
});

var BdayModel = mongoose.model('Bday', bdaySchema);

const query = BdayModel.find({name: 'Gandhar'});
console.log(query.all());