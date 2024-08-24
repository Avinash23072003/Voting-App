const mongoose=require('mongoose');

require('dotenv').config();
const mongoURl=process.env.LOCAL_URL
//const mongoURl=process.env.DB_URL

mongoose.connect(mongoURl,{
  
})

const db=mongoose.connection
db.on('connected',()=>{
    console.log("database connected succesfully");
})

db.on('error',(err)=>{
    console.log('MongoDB connection error', err)
})
db.on('disconnected',()=>{
    console.log("database disconnected");
})

module.exports=db