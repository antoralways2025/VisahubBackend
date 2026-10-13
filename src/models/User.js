const mongoose=require("mongoose");
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true,maxlength:100},email:{type:String,required:true,trim:true,lowercase:true,unique:true},passwordHash:{type:String,required:true,select:false},role:{type:String,enum:["admin","team"],default:"team",index:true},active:{type:Boolean,default:true}},{timestamps:true});
module.exports=mongoose.model("User",schema);
