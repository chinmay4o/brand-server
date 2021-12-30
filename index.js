import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { customerRouter } from "./router/customer.js";


dotenv.config({path : "./config.env"});

const app = express();
app.use(cors());
app.use(express.json());

//mongoose connection
const url = process.env.MONGO_URL;

mongoose.connect(url , {useNewUrlParser : true , useUnifiedTopology : true});
const conn = mongoose.connection;
conn.on("open" , () => console.log("mongodb connected"));

app.get("/" , (req , res) => {
  res.send("api in running...")
});


app.use("/", customerRouter);

app.listen(process.env.PORT , () => console.log("listening on " + process.env.PORT));

