import React, { useState, useRef } from "react";
import Input from "../authComponents/Input.jsx";
import Btn from "../authComponents/AuthBtn.jsx";
import './AuthForm.css'
function SignupForm() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const btnRef = useRef()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

   
    if (!name) {
      setError("Name required");
      nameRef.current.focus();
      return;
    }

    if (!email) {
      setError("Email required");
      emailRef.current.focus();
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 chars");
      passwordRef.current.focus();
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      confirmPasswordRef.current.focus();
      return;
    }

    setError("");
    console.log(formData);
  };

   const [showPassword, setshowPassword] = useState(false)
     const HandleEyeClick =()=>{
          setShowPassword(!showPassword);
     }

  return (
    <form onSubmit={handleSubmit}>

      <Input
        ref={nameRef}
        name="name"
        label="Name"
        value={formData.name}
        placeHolder="Enter your name"
        onChange={handleChange}
      />

      <Input
        ref={emailRef}
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        placeHolder="Enter your email"
        onChange={handleChange}
      />

      <Input
        ref={passwordRef}
        name="password"
        label="Password"
        type={showPassword?'text':'password'}
        value={formData.password}
        placeHolder="Enter password"
        handleEyeClick = {HandleEyeClick}
        onChange={handleChange}
      />

      <Input
        ref={confirmPasswordRef}
        name="confirmPassword"
        label="Confirm Password"
        type={showPassword?'text':'password'}
        value={formData.confirmPassword}
        placeHolder="Confirm password"
         handleEyeClick = {HandleEyeClick}
        onChange={handleChange}
      />

      {error && (
        <p style={{ color: "red", fontSize: "14px" }}>
          {error}
        </p>
      )}

      <Btn 
      type="submit"
      ref = {btnRef}
      >
        Signup
      </Btn>

    </form>
  );
}

export default SignupForm;