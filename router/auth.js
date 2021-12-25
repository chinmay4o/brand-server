import express from "express";
import { Users } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


const router = express.Router();
dotenv.config({ path: "./config.env" });

//nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// sample request = all users
router.get("/users", async (req, res) => {
  const data = await Users.find();
  res.send(data);
});

// register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ message: "fill the details first " });
  }

  const user = await Users.findOne({ email: email });
  if (user) {
    res.status(422).json({ message: "user already exists" });
    // throw new Error("user already exists");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({ email, password: hashedPassword });
    await newUser.save();

    res.send(newUser);

  } catch (err) {
    console.log(err);
    res.status(422).send(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).send("fill the details first ");
  }
  try {
    const user = await Users.findOne({ email: email });
    if (user) {
      const verifyUser = await bcrypt.compare(password, user.password);
      if (verifyUser) {
        const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
        user.tokens = user.tokens.concat({ token: token });
        await user.save();
        console.log(token);

        res.cookie("jwttoken", token, {
          sameSite: "none",
          httpOnly: true,
          secure: true,
        });

        res.json({user , tokenAll : token});
      } else {
        throw new Error("passsword not valid");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(422).send(err);
  }
});


// About page auth
// router.get("/about", authenticate, async (req, res) => {
//   console.log(req.rootUser);
//   res.send(req.rootUser);
//   // res.send("success");
// });


//Dahsboard page auth page
// router.get("/dashboard", authenticate, async (req, res) => {
//   console.log(req.rootUser);
//   res.send(req.rootUser);
// });


//logout button
// router.post("/logout", async (req, res) => {
//   try {
// const cookieToken = req.cookies.jwttoken;
// await Users.findOneAndRemove({"tokens.token" : cookieToken });
//     res.clearCookie(cookieToken);
//     console.log(req.token);
//     // await req.rootUser.save();
//     res.json({ message: "cleared cookie" });
//     res.render("login");
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });


export const userRouter = router;
