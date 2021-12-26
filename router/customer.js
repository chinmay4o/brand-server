import express from "express";
import { Customers } from "../models/customerSchema.js";
import { Recharge } from "../models/rechargeSchema.js";
import { Contact } from "../models/ContactSchema.js";
import { Users } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const router = express.Router();

//   getting customers from the database
router.get("/customers", async (req, res) => {
  const data = await Customers.find();
  res.send(data);
});

//   adding customers to the database
router.post("/data", async (req, res) => {
  const { cname, email, number, address } = req.body;

  const newData = new Customers({
    name: cname,
    email,
    number,
    address,
  });

  await newData.save();

  res.json(newData);
});

//   adding recharge customers to the database
router.post("/recharge", async (req, res) => {
  const { cname, number } = req.body;

  const newData = new Recharge({
    name: cname,
    number,
  });

  await newData.save();

  res.json(newData);
});

//   sending recharge customers to the database
router.get("/recharge", async (req, res) => {
  const data = await Recharge.find();
  res.json(data);
});


//   post request for contact form
router.post("/contact", async (req, res) => {
  const { cname, email, number, address } = req.body;

  const newData = new Contact({
    name: cname,
    email,
    number,
    address,
  });

  await newData.save();

  res.json(newData);
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


//register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ message: "fill the details first " });
  }

  const user = await Users.findOne({ email: email });

  if (user) {
    res.status(422).json({ message: "user already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({ email, password: hashedPassword });
    await newUser.save();

    res.json(newUser);
  } catch (err) {
    console.log(err);
    res.status(422).send(err);
  }
});


export const customerRouter = router;
