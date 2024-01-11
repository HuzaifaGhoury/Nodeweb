const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
    }
    // token: {
    //   type: String,
    // },
  },{timesstamps:true});
  
module.exports =  mongoose.model("User", userSchema);
