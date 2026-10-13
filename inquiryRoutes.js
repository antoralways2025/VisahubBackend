const express=require("express");const validator=require("validator");const Inquiry=require("../models/Inquiry");const asyncHandler=require("../utils/asyncHandler");const {sendEmail}=require("../utils/sendEmail");const {protect,requireAdmin}=require("../middleware/auth");const router=express.Router();
const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
router.post("/",asyncHandler(async(req,res)=>{
 const name=String(req.body.name||"").trim(),email=String(req.body.email||"").trim().toLowerCase(),phone=String(req.body.phone||"").trim(),destination=String(req.body.destination||"").trim(),service=String(req.body.service||"").trim(),message=String(req.body.message||"").trim();
 if(String(req.body.website||"").trim())return res.status(201).json({message:"Your request has been received."});
 if(!name||name.length>100)return res.status(400).json({message:"Enter a valid name (maximum 100 characters)."});
 if(!validator.isEmail(email)||email.length>160)return res.status(400).json({message:"Enter a valid email address."});
 if(phone.length<7||phone.length>40)return res.status(400).json({message:"Enter a valid phone number."});
 if(message.length>2000)return res.status(400).json({message:"Message must be 2000 characters or fewer."});
 const inquiry=await Inquiry.create({name,email,phone,destination,service,message,source:"website"});
 if(process.env.ADMIN_NOTIFICATION_EMAIL){try{await sendEmail({to:process.env.ADMIN_NOTIFICATION_EMAIL,subject:`New visa consultation request: ${name}`,text:`New consultation request
Name: ${name}
Email: ${email}
Phone: ${phone}
Destination: ${destination}
Service: ${service}
Message: ${message||"(none)"}
Inquiry ID: ${inquiry._id}`,html:`<h2>New visa consultation request</h2><p><b>Name:</b> ${esc(name)}</p><p><b>Email:</b> ${esc(email)}</p><p><b>Phone:</b> ${esc(phone)}</p><p><b>Destination:</b> ${esc(destination)}</p><p><b>Service:</b> ${esc(service)}</p><p><b>Message:</b> ${esc(message||"(none)")}</p><p><b>Inquiry ID:</b> ${inquiry._id}</p>`});}catch(e){console.error("Inquiry saved, email failed:",e.message);}}else console.warn("ADMIN_NOTIFICATION_EMAIL is missing.");
 res.status(201).json({message:"Thank you. Your consultation request has been received.",inquiryId:inquiry._id});
}));
router.get("/",protect,requireAdmin,asyncHandler(async(req,res)=>{const page=Math.max(1,parseInt(req.query.page,10)||1),limit=Math.min(100,Math.max(1,parseInt(req.query.limit,10)||20)),filter={};if(["new","contacted","in_progress","completed","rejected"].includes(req.query.status))filter.status=req.query.status;const [items,total]=await Promise.all([Inquiry.find(filter).populate("assignedTo","name email").sort({createdAt:-1}).skip((page-1)*limit).limit(limit),Inquiry.countDocuments(filter)]);res.json({items,total,page,pages:Math.ceil(total/limit)});}));
module.exports=router;