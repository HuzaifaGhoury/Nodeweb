// // const express = require('express');
// // const fs = require('fs');
// // const bcrypt = require('bcrypt');
// // const randomstring = require('randomstring');
// // const nodemailer = require('nodemailer');
// // const collection = require('./config');
// // const app = express();

// // app.use(express.json());
// // app.use(express.urlencoded({ extended: false }));

// // const transporter = nodemailer.createTransport({
// //   service: 'Gmail',
// //   auth: {
// //     user: 'khzoya0@gmail.com',
// //     pass: 'zoyasajid',
// //   },
// // });

// // app.get('/', (req, res) => {
// //   const data = fs.readFileSync('signin.html');
// //   res.end(data.toString());
// // });

// // app.get('/forgetpassword', (req, res) => {
// //   const data = fs.readFileSync('forgetPassword.html');
// //   res.end(data.toString());
// // });

// // app.get('/signup', (req, res) => {
// //   const data = fs.readFileSync('signup.html');
// //   res.end(data.toString());
// // });

// // app.get('/home', (req, res) => {
// //     console.log(req.session,"hello")
// //   if (req.session && req.session.isAuthenticated) {
// //     const data = fs.readFileSync('home.html');
// //     res.end(data.toString());
// //   } else {
// //     res.redirect('/');
// //   }
// // });

// // app.delete('/delete-account/:userId', async (req, res) => {
// //   const userId = req.params.userId;

// //   try {
// //     const result = await collection.deleteOne({ _id: userId });

// //     if (result.deletedCount === 1) {
// //       res.status(200).json({ message: 'Account deleted successfully' });
// //     } else {
// //       res.status(404).json({ message: 'User not found' });
// //     }
// //   } catch (error) {
// //     console.error('Error deleting account:', error);
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // });

// // app.post('/signup', async (req, res) => {
// //   const data = {
// //     email: req.body.email,
// //     name: req.body.username,
// //     password: req.body.password,
// //     isVerified: false,
// //     verificationToken: randomstring.generate(),
// //   };

// //   console.log(data);

// //   const userExist = await collection.findOne({ name: data.name });
// //   const userEmailExist = await collection.findOne({ email: data.email });

// //   if (userExist || userEmailExist) {
// //     res.send('User already exists');
// //   } else {
// //     const numRoll = 10;
// //     const hashedPswd = await bcrypt.hash(data.password, numRoll);
// //     data.password = hashedPswd;

// //     const userData = await collection.insertMany(data);

// //     const mailOptions = {
// //       from: 'khzoya0@gmail.com',
// //       to: data.email,
// //       subject: 'Email Verification',
// //       text: `Click on the following link to verify your email: http://localhost:3000/verify?token=${data.verificationToken}`,
// //     };

// //     transporter.sendMail(mailOptions, (error, info) => {
// //       if (error) {
// //         console.error(error);
// //         res.send('Error sending verification email');
// //       } else {
// //         console.log('Email sent: ' + info.response);
// //         req.session.isAuthenticated = true;
// //         res.redirect('/home');
// //       }
// //     });
// //   }
// // });

// // app.get('/verify', async (req, res) => {
// //   const token = req.query.token;

// //   const user = await collection.findOne({ verificationToken: token });

// //   if (user) {
// //     user.isVerified = true;
// //     user.verificationToken = undefined;
// //     await user.save();

// //     req.session.isAuthenticated = true;
// //     res.redirect('/home');
// //   } else {
// //     res.send('Invalid verification token');
// //   }
// // });

// // app.post('/login', async (req, res) => {
// //   try {
// //     const checkUser = await collection.findOne({ name: req.body.username });

// //     if (!checkUser) {
// //       res.send('User not found, please sign up first');
// //     } else {
// //       if (!checkUser.isVerified) {
// //         res.send('Please verify your email before logging in');
// //       } else {
// //         const isPswdMatch = await bcrypt.compare(req.body.password, checkUser.password);

// //         if (!isPswdMatch) {
// //           res.send('Wrong password');
// //         } else {
// //           req.session.isAuthenticated = true;
// //           res.redirect('/home');
// //         }
// //       }
// //     }
// //   } catch (error) {
// //     console.error(error);
// //     res.send('An error occurred');
// //   }
// // });

// // app.get('*', (req, res) => {
// //   res.redirect('/');
// // });

// // app.listen(3000, () => {
// //   console.log('Server is running on port 3000');
// // });

// //pswd omnmjqco3RQjNBKT

// const express = require("express");
// const User = require("./userModel");
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const cookie = require("cookie");
// const cookieParser = require('cookie-parser');

// const cors = require("cors");
// const app = express();
// const port = 3001;
// app.use(cookieParser());
// app.use(express.json());
// app.use(cors());
// const secretKey = "userAuth";
// mongoose.connect(
//   "mongodb+srv://sajidzoya72:omnmjqco3RQjNBKT@cluster0.u5nd9fa.mongodb.net/?retryWrites=true&w=majority"
// );
// app.get("/", (req, res) => {
//   res.json({
//     message: "its a main page",
//   });
// });

// app.post("/signup", async (req, res) => {
//   console.log(req.body);
//   const { username, email, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });
//     await newUser.save();
//     res.send({ code: 200, message: "User saved successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ code: 500, message: "Error saving user" });
//   }
// });

// app.post("/signin", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     console.log(user, "user");
//     if (!user) {
//       res.status(401).send({ code: 401, message: "User not found" });
//       return;
//     }
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       res.status(401).send({ code: 401, message: "Wrong password" });
//       return;
//     }

//     const token = jwt.sign(
//       { userId: user._id, username: user.username, email: user.email },
//       secretKey,
//       {
//         expiresIn: "1h",
//       }
//     );
//     console.log("username", user.username);
//     // const secureCookie = true;
//     // const httpOnlyCookie = true;
//     // const cookieOptions = {
//     //   secure: secureCookie,
//     //   httpOnly: httpOnlyCookie,
//     // };

//     // const cookieString = cookie.serialize("jwtToken", token, cookieOptions);
//     res.cookie("jwtToken", token);

//     // res.setHeader("Set-Cookie", cookieString);
//     res.status(200).json({ token });

//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ code: 500, message: "Error authenticating user" });
//   }
// });

// function verifyToken(req, res, next) {
//   const token = req.cookies?.jwtToken;

//   if (!token) {
//     return res.status(401).json({ error: 'Access denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// }

// app.get('/user', verifyToken, (req, res) => {
//   res.status(200).json({ message: 'Protected route accessed' });
// });

// // app.get("/user", verifyToken, (req, res) => {
// //   const userId = req.body._id;

// //   const userData = userId;
// //   if (userData) {
// //     res.status(200).json({ user: userData });
// //   } else {
// //     res.status(401);
// //   }
// // });
// // app.post("/signup", async (req, res) => {
// //   try {
// //     console.log(req.body)
// //     const { username, password } = req.body;

// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     const newUser = new User({ username, password: hashedPassword });

// //     await newUser.save();

// //     res.status(201).json({ code: 200, message: "User successfully created" });
// //   } catch (error) {
// //     res.status(500).json({ code: 500, message: "Internal server error" });
// //   }
// // });

// // app.post("/login",(req,res)=>{
// //   const user = {
// //     id:1,
// //     name:'john',
// //     email:'john@gmail.com'
// //   }
// //   jwt.sign({user},secretKey, (err,token)=>{
// // res.json({
// //   token
// // })
// //   })
// // })
// // Sign-up endpoint
// // app.post('/signup',  (req, res) => {
// //   console.log(req.body);
// // const username = req.body.username
// // const password = req.body.password

// // new User({username,password}).save((err,success)=>{
// //   if(err){
// //     res.send({code:500,message:"Err" })
// //   }if(success){
// // res.send({code: 200 , message : "saving"})
// //   }
// // })
// // });

// // try {
// //   const { username, password,email } = req.body;
// //   const hashedPassword = await bcrypt.hash(password, 10);
// //   const newUser = new User({email, username, password: hashedPassword });
// //   await newUser.save();

// //   res.status(201).json({ message: "User successfully created" });
// // } catch (error) {
// //   res.status(500).json({ error: "Internal hello server error" });
// // }
// // });

// // // Sign-in endpoint
// // app.post("/signin", async (req, res) => {
// //   try {
// //     const { username, password } = req.body;

// //     const user = await User.findOne({ username });

// //     if (user && (await bcrypt.compare(password, user.password))) {
// //       const token = jwt.sign(
// //         { userId: user._id, username: user.username },
// //         secretKey
// //       );

// //       res.json({ token });
// //     } else {
// //       res.status(401).json({ error: "Invalid credentials" });
// //     }
// //   } catch (error) {
// //     res.status(500).json({ error: "Internal server error" });
// //   }
// // });

// // function verifyToken (req, res, next) {
// //   const token = req.headers.authorization;
// //   console.log(token);
// //   if (!token) {
// //     return res.status(401).json({ error: "Access denied" });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, secretKey);
// //     req.body.id = decoded.userId;
// //     next();
// //   } catch (error) {
// //     res.status(401).json({ error: "Invalid token" });
// //   }
// // }
// app.listen(port, () => {
//   console.log(`Server ${port} `);
// });const express = require("express");
// let car = {
//   name: "BMW",
//   model: "X5",
//   price: 50000,
// };
// app.get("/setcar", (req, res) => {
//   res.cookie("carData", car);
//   res.send("car data is stored in cookies");
// });

// app.get("/getcar", (req, res) => {
//   const userCookie = req.cookies.carData;
//   console.log(userCookie, "userCookie");
// });
const User = require("./userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const app = express();
const port = 3001;

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

const secretKey = "userAuth";

mongoose.connect(
  "mongodb+srv://sajidzoya72:omnmjqco3RQjNBKT@cluster0.u5nd9fa.mongodb.net/?retryWrites=true&w=majority"
);

app.get("/", (req, res) => {
  res.json({
    message: "It's the main page",
  });
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ code: 200, message: "User saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Error saving user" });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ code: 401, message: "User not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ code: 401, message: "Wrong password" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Error authenticating user" });
  }
});

function verifyToken(req, res, next) {
  const token = req.cookies.jwtToken;
  // console.log(token);

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

app.get("/user", verifyToken, (req, res) => {
  res.status(200).json({ message: "Protected route accessed" });
});
app.get('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
