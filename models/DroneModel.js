var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var DroneSchema = new Schema({
	name : String,
	image : String,
	price : Number,
	weight : Number,
	long_length : Number,//긴쪽 길이
	short_length : Number,//짧은 쪽 길이
	store : Number,//재고
	description : String,//상세설명
	part : Number,//어디 부품인지 ex)1:모터, 2: 날개..
	thrust : Number, //추력(모터만)
	HOU : Number,//Hours Of Use(배터리 사용시간)
	rating : Number, //안테나 수신세기
	frameMaterial : String,//프레임 재질 ex)1:카본 2:플라스틱 3:스테인리스
	wingMaterial : String
},{collection:'drone'});

module.exports = mongoose.model('drone', DroneSchema);
