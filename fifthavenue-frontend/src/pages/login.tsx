import { useState } from "react";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import { getUser, useRegisterMutation } from "../redux/api/userAPI";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Correctly call useNavigate at the top level of the component

  const loginHandler = async () => {
    try {
      const res = await register({
        email: email!,
        password,
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
      toast.error("Login Failed");
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

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
          <Link to="/signup">
            <p>New User?</p>
          </Link>
          <button onClick={loginHandler}>
            <span>Login</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
