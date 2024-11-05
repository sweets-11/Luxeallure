import mongoose, {  } from "mongoose";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

import jwt from "jsonwebtoken";

interface JwtPayload {
  _id: mongoose.Types.ObjectId
}

// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Please login first", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid Id", 401));
  if (user.role !== "admin")
    return next(new ErrorHandler("Invalid Id", 403));

  next();
});


export const isAuthenticated = async (req : any, res :any, next:any) => {

  const { token } = req.cookies;

  if (!token) {
    return res
    .status(401)
    .json({ success: false, message: "Token not found" });
  }
    
  const { _id } = jwt.verify(token, 'adajdbjfyuttgtahahhhahhahhao') as JwtPayload
    req.user = await User.findById(_id);
    next();
  
  
};