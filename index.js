import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {customerRouter} from "./router/customer.js";


const app  = express();

app.use(
  express.json({
    extended: false,
  })
);

app.use(cors({
  origin: true
  }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origins, X-Requested-With, Content-Type, Accept');
    res.header("Access-Control-Allow-Method", "*");
    next();
})


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