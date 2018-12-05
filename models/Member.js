var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const crypto = require('crypto');
const config = require('../config');

var Member = new Schema({
    id : {type:String, required: true, unique :true},
    password : {type: String, required: true},
    name : {type: String, required: true},
    email : {type: String, required: true},
    role : {type : String, required: true}
},{collection:'member'});

Member.statics.create = function(id, password, name, email, role) {
    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')
    const member = new this({
        id,
        password: encrypted,
        name,
        email,
        role
    })

    // return the Promise
    return member.save()
}

// find one user by using username
Member.statics.findOneByUsername = function(id) {
    return this.findOne({
        id
    }).exec()
}


// verify the password of the User documment
Member.methods.verify = function(password) {
    const encrypted = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')

    return this.password === encrypted
}


module.exports = mongoose.model('member',Member);
