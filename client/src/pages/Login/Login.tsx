'use client'
import React, { useContext, useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import toast from 'react-hot-toast';

import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

import { GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';

import { useForm } from 'react-hook-form';

import { Link, useNavigate } from 'react-router-dom';
import { Context, valueType } from '../../Configs/ContextProvider';
import { User } from '../../types/types';




type Props = {}
type inputObject = {
  email: string,
  password: string
}



export default function page({ }: Props) {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const contextValue = useContext<valueType | null>(Context)
  const [showPassword, setShowPassword] = useState(false);





  const { user, setUser, logOut, emailSignIn, setDbUser, dbUser, loggedIn, setLoggedIn, loading, setLoading } = contextValue!


  console.log('DBUSER :::::::::::::::::::', dbUser);


  const { register, handleSubmit } = useForm<inputObject>()




  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const loginFromDB = async (user: User) => {
    // save user to DB

    try {
      const res = await axios.post('/login', user)

      if (res.status == 200) {


        setDbUser(res.data.user)
        console.log('response from my db............', res.data.user);
        localStorage.setItem('chat-app', res.data.token)
        setLoggedIn(true)
        setIsLoading(false)
        setLoading(false)
      } else {

      }

    } catch (error) {
      await logOut()
    } finally {
      setLoading(false)
    }
  }






  const handleLogin = (data: inputObject) => {
    console.log(data);
    if (/^\s*$/.test(data.email) || /^\s*$/.test(data.password)) {
      toast.error('Please Enter something ')
    } else {
      setIsLoading(true)
      setLoading(true)
      emailSignIn(data.email, data.password).then((userCredential) => {
        const user = userCredential.user;
        console.log('userCredentials from firebase..', user);
        loginFromDB(user)
        setUser(user)
        setLoading(false)
        setIsLoading(false)
      })
        .catch((error: any) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false)
          setIsLoading(false)
        });
    }
  }

  return (
    <>

      <div className='background min-h-[100vh] text-center flex flex-col-reverse md:flex-row gap-10 justify-center items-center '>
        <div className='w-fit '>
          <div className='rounded-lg py-5 backdrop-blur-md bg-gray-200 bg-opacity-[0.09] border border-opacity-10 border-gray-400 max-w-md  transition-all ease-in-out duration-500 hover:shadow-2xl '>
            <div className='w-fit mx-auto'>
              <h3 className='text-3xl font-bold text-gray-300'>Chitchatz</h3>
            </div>

            <h3 className='text-xl text-white font-thin md:font-thin px-5 md:px-10 mb-6'>Sign in to you account</h3>

            <form className='max-w-md  px-5 md:px-10 mx-auto flex flex-col items-center justify-center gap-1 pb-5' onSubmit={handleSubmit(handleLogin)} >
              <input {...register('email')} className='p-2 m-2 w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:outline-gray-300' type="text" placeholder='Enter your Email' />

              <div className="relative m-2 w-full rounded-lg border">
                <input
                  {...register('password')}
                  className="p-2  w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:outline-gray-300"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your Password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute top-0 right-0 mt-3 pe-1 text-gray-700 mr-2"
                >
                  {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                </button>
              </div>

              <button className='border py-2 px-4 rounded-lg bg-[#81689D] text-white hover:shadow-xl transition-all ease-in-out duration-300 hover:scale-105 border-0 '>
                {isLoading ?
                  <AiOutlineLoading3Quarters className='text-2xl animate-spin' />
                  :
                  <span>Login</span>
                }
              </button>
            </form>
            <div className='max-w-md  px-5 md:px-10'>
              <h3 className='text-gray-200 text-center  text-sm py-3'> New to NextChat? <span className='animate-pulse text-base text-blue-300'> <Link to={'/register'} >Create an account!</Link> </span></h3>



            </div>
          </div>
        </div>



      </div></>


  )
}


