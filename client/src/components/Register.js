import React, { useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

const schema = yup
  .object({
    username: yup.string().required().min(3).max(30),
    password: yup.string().required().min(6).max(30),
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

function Register() {
  const [
    user,
    setUser,
    isLoggedIn,
    setIsLoggedIn,
    isLoading,
    setIsLoading,
    isError,
    setIsError,
  ] = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ username, password }) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const res = await axios.post("/users/new", {
        username,
        password,
      });
      if (res.data.isLoggedIn === true) {
        setUser({ username: res.data.user.username });
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(res.data.isLoggedIn);
      }
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  if (isError) return <h1>Error, try again!</h1>;
  if (isLoading) return <h1>Loading...</h1>;
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Register</h1>
        <label htmlFor="username">Username:</label>
        <input id="username" {...register("username")} />
        {errors.username && <span>{errors.username.message}</span>}
        <label htmlFor="password">Password:</label>
        <input id="password" {...register("password")} />
        {errors.password && <span>{errors.password.message}</span>}
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input id="confirmPassword" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <span>{errors.confirmPassword.message}</span>
        )}
        <button type="submit">Sign Up</button>
      </form>
      <Link to="/login">Login</Link>
      <Link to="/">User Route</Link>
      {isLoggedIn && <Navigate to="/" />}
    </div>
  );
}

export default Register;
