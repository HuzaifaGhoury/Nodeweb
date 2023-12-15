const mangoose = require ("mongoose")

const connect = mangoose.connect("mongodb+srv://sajidzoya72:Im1sXHD9DZK4gSjS@cluster0.oansiuo.mongodb.net/?retryWrites=true&w=majority")

connect.then(()=>{
    console.log("database connected")
}).catch(()=>{
    console.log("not connected")
})

const loginSchema = new mangoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const collection = new mangoose.model("users",loginSchema)
module.exports = collection