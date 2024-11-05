import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { sendToken } from "../utils/jwtToken.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, password, dob ,gender} = req.body;

    let user = await User.findOne({email : email});

    if (user)
      return res.status(404).json({
        success: false,
        message: `Account Already Exist Please try login `,
      });

    if (!name || !email  || !password || !dob)
      return next(new ErrorHandler("Please add all fields", 400));

    user = await User.create({
      name,
      email,
      password,
      dob: new Date(dob),
      gender
    });

    
  sendToken(res, user,201,"Account Created Sucessfully");
 
  }
);

export const login = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {  email, password, } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(404).json({
        success: false,
        message: `Account doesn't exist Please try register first `,
      });

    if (!email  || !password )
      return next(new ErrorHandler("Please add all fields", 400));

    
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
    
  sendToken(res ,user,200,`welcome Back ${user.name}`);
 
  }
);

export const logout = TryCatch(
  async (
    req,
    res,
    next
  ) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });

     }
);



export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid Id", 400));

  return res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid Id", 400));

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
