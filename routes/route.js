//route

var express=require('express');
var router = express.Router();
//////////디비 추가/////////
var BoardModel = require('../models/BoardModel');
var Member = require ('../models/Member');
var Drone = require('../models/DroneModel');
var MongoClient = require('mongodb').MongoClient; ////
var url = "mongodb://localhost/test";
////////////////////////////
var signActions =require('../auth/signActions');

var flag;
var frame = new Array();
var wing = new Array();
var cb = new Array();
var esc = new Array();
var battery = new Array();
var ant = new Array();
var motor = new Array();
/*
0: price, 1: weight, 2: long_length, 3: short_length, 4: store, 5: HOU, 6: rating, 7: thrust
*/

const fs =require('fs');

function DB(){
	this.db=null;
}////추가

router.get('/', function(req,res){
	//res.json({"hi":"hi"});
        //res.writeHead(200, {'Content-Type':'text/html'});
	//fs.readFile('/home/ec2-user/temp/build/index.html', (err, data)=>{
	//	console.log(err);
	//	res.sendFile(data,'utf-8');
	//})
	res.sendFile('/home/ec2-user/temp/build/index.html');
});
router.get('/board_list',function(req,res){
	BoardModel.find({})
		   .exec(function(err, boards){
			if(err) res.status(403).json({success:false});
		console.log(boards);
		res.json(boards);
		});
});
router.get('/member',function(req,res){
	Member.find({})
            	.exec(function(err, boards){
			if(err) res.status(403).json({success:false});
		console.log(boards);
		res.json(boards);
		});
});
/* 드론 견적 */
router.get('/drone',function(req,res){
	Drone.find({"part":{$eq:1}})
		.exec(function(err, boards){
			if(err) res.status(403).json({success:false});
		console.log(boards);
		res.json(boards);
		});
});
router.post('/drone',function(req,res){
	console.log("post drone");
	console.log("------------------------------------");
	flag = req.body.part;
	
	

	if(flag==1){
		frame[0] = req.body.price;
		frame[1] = req.body.weight;
		frame[2] = req.body.long_length;
		frame[3] = req.body.short_length;
		frame[4] = req.body.store;
		//frame[5] = req.body.HOU;
		//frame[6] = req.body.rating
		Drone.find({$and:[{"part":{$eq:2}}, {"long_length": {$lt:frame[2]}}]})
			.exec(function(err,boards){
				if(err) res.status(403).json({success:false});
				
			console.log("=============================frame==================================")
			console.log(boards);
			console.log("====================================================================")
			res.json(boards);
			});
	}
	else if(flag==2){
		wing[0] = req.body.price;
		wing[1] = req.body.weight;
		wing[2] = req.body.long_length;
		wing[3] = req.body.short_length;
		wing[4] = req.body.store;
		//frame[5] = req.body.HOU;
		//frame[6] = req.body.rating
		Drone.find({$or:[{"part":{$eq:1}},{$and:[{"part":{$eq:3}}, {"short_length": {$lt:frame[3]}}]}]})
			.exec(function(err,boards){
				if(err) res.status(403).json({success:false});
			console.log("=============================Wings==================================")
			console.log(boards);
			console.log("====================================================================")	
			res.json(boards);
			});
	}
	else if(flag==3){
		cb[0] = req.body.price;
		cb[1] = req.body.weight;
		cb[2] = req.body.long_length;
		cb[3] = req.body.short_length;
		cb[4] = req.body.store;
		//frame[5] = req.body.HOU;
		//frame[6] = req.body.rating
		var num;
		num = frame[3]-cb[3];
		Drone.find({$or:[{$and:[{"part":{$eq:2}}, {"long_length": {$lt:frame[2]}}]},{$and:[{"part":{$eq:4}}, {"short_length": {$lt:num}}]}]})  
			.exec(function(err,boards){
				if(err) res.status(403).json({success:false});
			console.log("===============================CB===================================")
			console.log(boards);
			console.log("====================================================================")
			res.json(boards);
			});
	}
	else if(flag==4){
		esc[0] = req.body.price;
		esc[1] = req.body.weight;
		esc[2] = req.body.long_length;
		esc[3] = req.body.short_length;
		esc[4] = req.body.store;
		//frame[5] = req.body.HOU;
		//frame[6] = req.body.rating
		//var num;
		//num = frame[3]-cb[3];
		Drone.find({$or:[{$and:[{"part":{$eq:3}}, {"short_length": {$lt:frame[3]}}]},{"part":{$eq:5}}]})
			.exec(function(err,boards){
				if(err) res.status(403).json({success:false});
			console.log("==============================ESC===================================")
			console.log(boards);
			console.log("====================================================================")
			res.json(boards);
			});
	}
	else if(flag==5){
		battery[0] = req.body.price;
		battery[1] = req.body.weight;
		battery[2] = req.body.long_length;
		battery[3] = req.body.short_length;
		battery[4] = req.body.store;
		battery[5] = req.body.HOU;
		//frame[6] = req.body.rating
		Drone.find({$or:[{$and:[{"part":{$eq:4}}, {"short_length": {$lt:frame[3]}}]}, {"part":{$eq:6}}]})
			.exec(function(err,boards){
				if(err) res.status(403).json({success:false});
			console.log("============================battery=================================")
			console.log(boards);
			console.log("====================================================================")
			res.json(boards);
			});
	}
	else if(flag==6){
		ant[0] = req.body.price;
		ant[1] = req.body.weight;
		ant[2] = req.body.long_length;
		ant[3] = req.body.short_length;
		ant[4] = req.body.store;
		ant[5] = req.body.HOU;
		ant[6] = req.body.rating

		var weightSum;
		weightSum += frame[1];
		weightSum += wing[1];
		weightSum += cb[1];
		weightSum += esc[1];
		weightSum += battery[1];
		weightSum += ant[1];
		var arr = new Array();
		Drone.find({$or:[{"part":{$eq:5}},{"part":{$eq:7}}]}, {$where:function(){return this.weight+weightSum < this.thrust}})
			.exec(function(err,boards){
				if(err) res.status(403).json({success:false});
			console.log("============================Antenna=================================")
			console.log(boards);
			console.log("====================================================================")
			res.json(boards);
			});
		/*Drone.find({"part": {$eq:7}}).$where(function(){
 return this.weight+weightSum < thrust;
})
			.exec(function(err,boards){
				if(err) res.status(403).json({success:false});
			console.log(boards);
			res.json(boards);
			});*/
	}
	else if(flag==7){
		motor[0] = req.body.price;
		motor[1] = req.body.weight;
		motor[2] = req.body.long_length;
		motor[3] = req.body.short_length;
		motor[4] = req.body.store;
		motor[5] = req.body.HOU;
		motor[6] = req.body.rating
		motor[7] = req.body.thrust;
		var priceSum;

		priceSum += frame[0];
		priceSum += wing[0];
		priceSum += cb[0];
		priceSum += esc[0];
		priceSum += battery[0];
		priceSum += ant[0];
		priceSum += motor[0];
		Drone.find({"part":{$eq:6}})
			.exec(function(err,boards){
				if(err) res.status(403).json({success:false});
			console.log("============================Motor=================================")
			console.log(boards);
			console.log("====================================================================")
			res.json(boards);
			});
		/*if(weightSum >= motor[7]){
			res.send("Motor's thrust is not enough!!! Please select another motor.");
		}
		else if(weightSum < motor[7]){
			res.send("OK");
		}*/
	}
});
/*드론 견적 종료*/
/*부품 구매*/
router.get('/buy',function(req,res){
	Drone.find({})
		.exec(function(err, boards){
			if(err) res.status(403).json({success:false});
		console.log(boards);
		res.json(boards);
		});
});

/*모터 판매 등록*/
router.post('/motor_sale', function(req,res){
    Drone.insert({"name": req.body.name, "price": req.body.price, "weight": req.body.weight, "thrust": req.body.thrust, "long_length": req.body.long_length, "short_length": req.body.short_length, "stock": req.body.stock, "description": req.body.description})
        .exec(function(err, boards){
            if(err) res.status(403).json({success:false});
        console.log(boards);
        });
});


router.post('/sign-up', signActions.signUp);
router.post('/login', signActions.signIn);


module.exports = router;
