import express from "express";
import { Customers } from "../models/customerSchema.js";
import { Recharge } from "../models/rechargeSchema.js";

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

export const customerRouter = router;
