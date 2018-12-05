e = require('mongoose');
var Member = require('../models/Member');
var jwt = require('jsonwebtoken')

var func = {
	signIn:function(req,res){
		console.log(req.body);
		Member.findOne({id: req.body.id, password: req.body.password},function(err, user){
			console.log(err)
			console.log(user)
			if(err||!user) res.json({success:false})
			else{
				let secret = 'droneDiyKimBK'
				let expire_time = Math.floor(Date.now()/1000 - 30)//30초 유통기한
				let token = jwt.sign({ id: user.id, iat: expire_time}, secret);
				res.json({success:true, token})
			}
		}
		);
	},
	signUp:function(req,res){
		console.log(req.body);
		let newMember = Member({
			id : req.body.id,
			password : req.body.password,
			name : req.body.name,
			email : req.body.mail,
			role : req.body.role
		});
		newMember.save(function(err, newMember){
			if (err||!newMember){
				console.log(err);
				res.json({success:false});
			}
			else{
				console.log(newMember)
				res.json({success:true});
			}
		})
	}
}

module.exports = func;
