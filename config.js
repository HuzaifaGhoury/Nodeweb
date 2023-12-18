const mangoose = require ("mongoose")

const connect = mangoose.connect("mongodb+srv://sajidzoya72:Im1sXHD9DZK4gSjS@cluster0.oansiuo.mongodb.net/?retryWrites=true&w=majority")

connect.then(()=>{
    console.log("database connected")
}).catch(()=>{
    console.log("not connected")
})


    const loginSchema = new mangoose.Schema({
        email: { type: String, unique: true, required: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        verificationToken: { type: String }
    });
const collection = new mangoose.model("users",loginSchema)
module.exports = collection


