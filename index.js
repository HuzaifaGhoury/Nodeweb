const express = require('express');
const fs = require("fs");
const bcrypt = require("bcrypt")
const collection = require('./config')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.get('/',(req,res)=>{
    const data = fs.readFileSync("signin.html");
    res.end(data.toString());})
app.get('/singup',(req,res)=>{
    const data = fs.readFileSync("signup.html");
    res.end(data.toString());})
app.get('/home',(req,res)=>{
    const data = fs.readFileSync("home.html");
    res.end(data.toString());})
app.listen(3000, () => {
    console.log('code running');
  });

  app.post("/signup",async (req,res)=>{
    const data = {
        name:req.body.username,
        password:req.body.password
    }
    const userExist = await collection.findOne({name:data.name})
    if(userExist){
        res.send("user already Exist")
    }else{
        const numRoll= 10
        const hashedPswd = await bcrypt.hash(data.password,numRoll)
        data.password = hashedPswd
const userData = await collection.insertMany(data)
res.redirect('/home');
    }
})

app.post('/login', async (req, res) => {
    try {
        const checkUser = await collection.findOne({ name: req.body.username });

        if (!checkUser) {
            res.send("User not found, please sign up first");
        } else {
            const isPswdMatch = await bcrypt.compare(req.body.password, checkUser.password);

            if (!isPswdMatch) {
                res.send("Wrong password");
            } else {
                res.redirect('/home');
            }
        }
    } catch (error) {
        console.error(error);
        res.send("An error occurred");
    }
});
    //pswd Im1sXHD9DZK4gSjS

    //userName sajidzoya72