import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"


export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password :string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
 
  //   Virtual Attribute
  age: number;
  comparePassword(password :any):boolean;
  getJWTToken():string;
  //   Virtual Attribute

}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    email: {
      type: String,
      unique: [true, "Email already Exist"],
      required: [true, "Please enter Name"],
      validate: validator.default.isEmail,
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please enter Gender"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    dob: {
      type: Date,
      required: [true, "Please enter Date of birth"],
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});


// Compare Password

schema.methods.comparePassword = async function (password : any) {
  return await bcrypt.compare(password, this.password);
};


schema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, "adajdbjfyuttgtahahhhahhahhao", {
    expiresIn: 100 * 24 * 60 * 60 * 1000,
  });
};


schema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
});
export const User = mongoose.model<IUser>("User", schema);
