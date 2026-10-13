const nodemailer=require("nodemailer");
async function sendEmail({to,subject,text,html}){
 if(!process.env.SMTP_HOST||!process.env.SMTP_USER||!process.env.SMTP_PASS){console.warn("SMTP not configured; inquiry was saved but email skipped.");return {skipped:true};}
 const transporter=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||465),secure:String(process.env.SMTP_SECURE).toLowerCase()==="true",auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});
 return transporter.sendMail({from:process.env.MAIL_FROM||process.env.SMTP_USER,to,subject,text,html});
}
module.exports={sendEmail};