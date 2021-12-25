import express from "express";
import { Customers } from "../models/customerSchema.js";

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
    name : cname,
    email,
    number,
    address,
  });

  await newData.save();

  res.json(newData);
});

export const customerRouter = router;
