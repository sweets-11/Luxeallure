import express from "express";
import {
convert
} from "../controllers/currencyConvertor.js";

const app = express.Router();

// route - /api/v1/order/new
app.get("/convert", convert);

export default app;
