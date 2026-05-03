import React, { useRef, useState } from 'react'
import Input from '../authComponents/Input.jsx'
import Btn from '../authComponents/AuthBtn.jsx'
import { Link } from 'react-router-dom'
import './AuthForm.css'


function LoginForm() {
  const loginRef = useRef()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password })
    // some task to do
  }

  const emailRef = useRef()
  const btnRef = useRef()
  const passwordRef = useRef()

   const [showPassword, setshowPassword] = useState(false)
   const HandleEyeClick =()=>{
        setShowPassword(!showPassword);
   }


  return (
    <form onSubmit={handleSubmit}>
      <Input
        ref={emailRef}
        label='Email'
        type='Email'
        value={email}
        PlaceHolder='Enter Your Email'
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        ref={passwordRef}
        label='Password'
        type='password'
        value={password}
        PlaceHolder='Password'
         handlEyeClick={HandleEyeClick}
        onChange={(e) => setPassword(e.target.value)}
      />
       
      <a className="forgot" href = 'https://google.com'>
        Forgot Password?
      </a>

      <Btn
        type='submit'
        ref={btnRef}
      >Login</Btn>

    </form>
  )
}

export default LoginForm