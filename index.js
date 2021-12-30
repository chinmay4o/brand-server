import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { customerRouter } from "./router/customer.js";
dotenv.config({ path: "./config.env" });

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

//mongodb connection
const url = process.env.DATABASE;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const onn = mongoose.connection;
onn.on("open", () => console.log("mongodb connected"));

app.use("/", customerRouter);

app.listen(process.env.PORT, () =>
  console.log("listening on port " + process.env.PORT)
);
