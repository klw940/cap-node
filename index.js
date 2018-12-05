//설치한 모듈
//express , mongosse, body-parser, method-override, multer
var cors= require('cors');
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var multer = require('multer');
var upload = multer({dest: 'images/'});

/* =======================
    port / route
==========================*/
const config = require('./config')
const port= process.env.PORT || 3001;
var route=require('./routes/route');

////////////////////////////////////////////////////////
const app = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// set the secret key variable for jwt
app.set('jwt-secret', config.secret)

// Routes
app.use(cors({credentials: true, origin: true}));
app.use("/", require("./routes/route"));

// configure api router
app.use('/api', require('./routes/api'))

// Port setting
app.listen(port, function(){
  console.log("server on!  ec2-52-32-190-25.us-west-2.compute.amazonaws.com:"+port);
});

/* =======================
    CONNECT TO MONGODB SERVER
==========================*/
// DB setting
mongoose.connect('mongodb://localhost/test',{useCreateIndex:true, useNewUrlParser: true});
var db = mongoose.connection;

//연결실패
db.on("error", function(err){
    console.log("DB ERROR : ", err);
  });

//연결
db.once("open", function(){
  console.log("DB connected");
});