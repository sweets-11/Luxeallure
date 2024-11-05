import { useState } from "react";
import toast from "react-hot-toast";
import { getUser, useLoginMutation } from "../redux/api/userAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const signUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Correctly call useNavigate at the top level of the component

  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      const res = await login({
        name: name,
        email: email!,
        gender,
        role: "user",
        password,
        dob: date,
      });

      if ("data" in res) {
        toast.success(res.data.message);
        console.log(res);

        const data = await getUser(res.data.user._id);
        localStorage.setItem('user', JSON.stringify(data));
        dispatch(userExist(data?.user!));

        navigate("/"); // Use navigate here
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
        dispatch(userNotExist());
      }
    } catch (error) {
      toast.error("Sign In Fail");
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Sign Up</h1>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Date of birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <button onClick={loginHandler}>
            <span>Sign up</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default signUp;
