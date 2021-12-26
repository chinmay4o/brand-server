import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from "mongoose";
import {customerRouter} from "./router/customer.js";


const app  = express();

app.use(express.json());

var dd = {
    origin : "*",
    credentials : true
  };

app.use(cors(dd));

dotenv.config({ path : "./config.env"});

//mongodb connection
const url = process.env.DATABASE;

mongoose.connect(url, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const onn = mongoose.connection;
onn.on("open" , () => console.log("mongodb connected"));

app.use("/", customerRouter);

app.listen(process.env.PORT , () => console.log("listening on port " + process.env.PORT));