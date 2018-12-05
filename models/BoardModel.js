var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//생성될 필드명을 정한다.
var BoardSchema = new Schema({
    number : Number,
    title : String,
    writer : String,
    contents : String,
    date : Date,
    hits : Number
},{collection:'freeboard'});

module.exports = mongoose.model('freeboard', BoardSchema);
