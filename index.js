// const express = require('express');
// const fs = require("fs");
// const bcrypt = require("bcrypt")
// const randomstring = require("randomstring");
// const collection = require('./config')
// const app = express()
// app.use(express.json())
// app.use(express.urlencoded({extended:false}))
// app.get('/',(req,res)=>{
//     const data = fs.readFileSync("signin.html");
//     res.end(data.toString());})
// app.get('/singup',(req,res)=>{
//     const data = fs.readFileSync("signup.html");
//     res.end(data.toString());})
// app.get('/home',(req,res)=>{
//     const data = fs.readFileSync("home.html");
//     res.end(data.toString());})
// app.listen(3000, () => {
//     console.log('code running');
//   });

//   app.post("/signup", async (req, res) => {
//     const data = {
//         email: req.body.email,
//         name: req.body.username,
//         password: req.body.password,
//         isVerified: false,
//         verificationToken: randomstring.generate()
//     };
//     console.log(data);

//     const userExist = await collection.findOne({ name: data.name });
//     const userEmailExist = await collection.findOne({ email: data.email });

//     if (userExist) {
//         res.send("User already exists");
//     }else if(userEmailExist){
//         res.send("User already exists");
//     } 
//     else {
//         const numRoll = 10;
//         const hashedPswd = await bcrypt.hash(data.password, numRoll);
//         data.password = hashedPswd;

        
//         const userData = await collection.insertMany(data);
        
//         console.log(userData);
//         res.redirect('/home');
//     }
// });


// app.post('/login', async (req, res) => {
//     try {
//         const checkUser = await collection.findOne({ name: req.body.username });

//         if (!checkUser) {
//             res.send("User not found, please sign up first");
//         } else {
//             const isPswdMatch = await bcrypt.compare(req.body.password, checkUser.password);

//             if (!isPswdMatch) {
//                 res.send("Wrong password");
//             } else {
//                 res.redirect('/home');
//             }
//         }
//     } catch (error) {
//         console.error(error);
//         res.send("An error occurred");
//     }
// });
//     //pswd Im1sXHD9DZK4gSjS

//     //userName sajidzoya72
const express = require('express');
const fs = require("fs");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const nodemailer = require('nodemailer');
const collection = require('./config');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
console.log(app.currentUser)
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'khzoya0gmail.com',
        pass: 'm.sarwar'
    }
});

app.get('/', (req, res) => {
    const data = fs.readFileSync("signin.html");
    res.end(data.toString());
});
app.get('/forgetpassword', (req, res) => {
    const data = fs.readFileSync("forgetPassword.html");
    res.end(data.toString());
});

app.get('/signup', (req, res) => {
    const data = fs.readFileSync("signup.html");
    res.end(data.toString());
});

app.get('/home', (req, res) => {
    const data = fs.readFileSync("home.html");
    res.end(data.toString());
});

app.post("/signup", async (req, res) => {
    const data = {
        email: req.body.email,
        name: req.body.username,
        password: req.body.password,
        isVerified: false,
        verificationToken: randomstring.generate()
    };

    console.log(data);

    const userExist = await collection.findOne({ name: data.name });
    const userEmailExist = await collection.findOne({ email: data.email });

    if (userExist || userEmailExist) {
        res.send("User already exists");
    } else {
        const numRoll = 10;
        const hashedPswd = await bcrypt.hash(data.password, numRoll);
        data.password = hashedPswd;

        const userData = await collection.insertMany(data);

        const mailOptions = {
            from: 'khzoya0gmail.com',
            to: data.email,
            subject: 'Email Verification',
            text: `Click on the following link to verify your email: http://localhost:3000/verify?token=${data.verificationToken}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.send("Error sending verification email");
            } else {
                console.log('Email sent: ' + info.response);
                res.send("Please check your email for verification");
            }
        });
    }
});

app.get('/verify', async (req, res) => {
    const token = req.query.token;

    const user = await collection.findOne({ verificationToken: token });

    if (user) {
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.redirect('/home');
    } else {
        res.send('Invalid verification token');
    }
});

app.post('/login', async (req, res) => {
    try {
        const checkUser = await collection.findOne({ name: req.body.username });

        if (!checkUser) {
            res.send("User not found, please sign up first");
        } else {
            if (!checkUser.isVerified) {
                res.send("Please verify your email before logging in");
            } else {
                const isPswdMatch = await bcrypt.compare(req.body.password, checkUser.password);

                if (!isPswdMatch) {
                    res.send("Wrong password");
                } else {
                    res.redirect('/home');
                }
            }
        }
    } catch (error) {
        console.error(error);
        res.send("An error occurred");
    }
});

app.listen(3000, () => {
    console.log('code running');
});
