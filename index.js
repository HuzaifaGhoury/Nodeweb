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
app.get("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
