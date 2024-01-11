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

// Signup API:
app.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({
          code: 400,
          message: "Email already in use. Choose a different one.",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      role,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({ code: 200, message: "User saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Error saving user" });
  }
});

// Login API:
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
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("jwtToken", token, { httpOnly: true });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Error authenticating user" });
  }
});

// Verify JwToken:
function verifyToken(req, res, next) {
  const token = req.cookies.jwtToken;
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Authentication middleware:
app.get("/user", verifyToken, (req, res) => {
  res.status(200).json({ message: "Protected route accessed" });
});

// Logout API:
app.get("/logout", (req, res) => {
  res.clearCookie("jwtToken");
  res.json({ message: "Logout successful" });
});

// Middleware to check user roles:
function checkUserRole(role) {
  return (req, res, next) => {
    if (req.userRole === role) {
      next();
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  };
}

// Role based routes:
app.get("/admindashboard", verifyToken, checkUserRole("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

app.get(
  "/teacherdashboard",
  verifyToken,
  checkUserRole("teacher"),
  (req, res) => {
    res.json({ message: "Teacher access granted" });
  }
);

app.get(
  "/studentdashboard",
  verifyToken,
  checkUserRole("student"),
  (req, res) => {
    res.json({ message: "Student access granted" });
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
