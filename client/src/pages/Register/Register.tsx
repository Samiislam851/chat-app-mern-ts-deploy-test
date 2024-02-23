import React, { useContext, useState } from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from 'react-hot-toast';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { Context, valueType } from '../../Configs/ContextProvider';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MongoUser } from '../../types/types';

type Props = {};
type inputObject = {
    name: string,
    email: string,
    password: string,
    image: string
};

const RegisterPage = ({ }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const contextValue = useContext<valueType | null>(Context);

    const [imageUploading, setImageUploading] = useState(false)
    const [imageUploadURL, setImageUploadURL] = useState('')
    const navigate = useNavigate();

    const { loading, setLoading, addUserDetails, logOut, emailRegister, setDbUser } = contextValue!;

    const { register, handleSubmit } = useForm<inputObject>();

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const saveUserToDB = async (user: MongoUser, retries = 3) => {
        try {
            const res = await axios.post('/saveUser', user);
            if (res.status === 200) {
                setDbUser(res.data.user);
                localStorage.setItem('chat-app', res.data.token);
                navigate('/dashboard');
            } else {
                await logOut();
            }
        } catch (error) {
            if (retries > 0) {
                await saveUserToDB(user, retries - 1);
            } else {
                toast.error('Failed to save user to the database after multiple attempts.');
                await logOut();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = (data: inputObject) => {
        const userData = { ...data };
        if (imageUploadURL.trim() == '' || /^\s*$/.test(data.email) || /^\s*$/.test(data.password) || /^\s*$/.test(data.name)) {
            toast.error(' Please provide all the information.');
        } else {
            setLoading(true);
            emailRegister(userData.email, userData.password)
                .then((userCredential) => {
                    setLoading(true);
                    addUserDetails(userData.name, imageUploadURL).then(() => {
                        setLoading(false);
                        console.log('Profile updated');
                    }).catch((err) => {
                        toast.error(err.message);
                        setLoading(false);
                    });
                    saveUserToDB({
                        name: userData.name,
                        email: userData.email,
                        photoURL: imageUploadURL,
                    });
                })
                .catch((error) => {
                    setLoading(false);
                    toast.error(error.message);
                });
        }
    };


    const imageUploadHandler = (e: any) => {
        const image = e.target.files[0];
        const formData = new FormData
        formData.append('image', image)
        setImageUploading(true)
        axios({
            method: 'POST',
            url: "https://api.imgbb.com/1/upload?expiration=0&key=3484ccd1195547b96304537de35952ef",
            headers: { "Content-Type": 'multipart/form-data' },
            data: formData
        }).then(res => {

            setImageUploadURL(res.data.data.display_url)
            setImageUploading(false)
        }).catch(err => {
            console.log(err);
            setImageUploading(false)
        })
    }

    return (
        <div className='background min-h-[100vh] text-center flex flex-col-reverse md:flex-row gap-10 justify-center items-center '>
            <div className='w-fit '>
                <div className='rounded-lg py-10 backdrop-blur-md bg-gray-300 bg-opacity-[0.09] border border-opacity-10 border-gray-400 max-w-md  transition-all ease-in-out duration-500   '>
                    <div className='w-fit mx-auto'>
                        <h3 className='text-3xl font-bold text-gray-300'>Chitchatz</h3>
                    </div>

                    <h3 className='text-xl text-white font-thin md:font-thin px-5 md:px-10 mb-6'>Create an account</h3>

                    <form className='max-w-md  px-5 md:px-10 mx-auto flex flex-col items-center justify-center gap-1 pb-5' onSubmit={handleSubmit(handleRegister)} >
                        <input required {...register('name')} className='p-2 m-2 w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:outline-gray-300' type="text" placeholder='Enter your Name' />

                        <div className='flex items-center justify-center'>
                            <input required {...register('image')} onChange={imageUploadHandler} type='file' className='p-2 m-2 w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:outline-gray-300 bg-gray-100 cursor-pointer flex-grow' placeholder='Enter your image link' />
                            {imageUploadURL.trim() !== '' &&
                                <div style={{backgroundImage: `url(${imageUploadURL})`}} className='h-7 w-7 hover:scale-[8] hover:z-[100] rounded-full transition-all ease-in-out bg-cover bg-center'>
                                    {/* <img src={imageUploadURL} className="h-full w-full " alt="uploaded image" /> */}
                                </div>
                            }
                        </div>

                        {imageUploading && <div className='animate-pulse text-gray-600 opacity-75'>Uploading Image...</div>}


                        <input required {...register('email')} className='p-2 m-2 w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:outline-gray-300' type="text" placeholder='Enter your Email' />
                        <div className="relative m-2 w-full rounded-lg border">
                            <input
                                {...register('password')}
                                className="p-2 w-full rounded-lg border border-gray-300 focus:border-gray-500 focus:outline-gray-300"
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
                        <button disabled={loading || imageUploading ? true : false} className={` border py-2 px-4 rounded-lg bg-[#81689D] text-white hover:shadow-xl transition-all ease-in-out duration-300 hover:scale-105 border-0 `}>
                            {loading || imageUploading ?
                                <AiOutlineLoading3Quarters className='text-3xl animate-spin' />
                                :
                                <span>Register</span>
                            }
                        </button>
                    </form>
                    <div className='max-w-md  px-5 md:px-10'>
                        <h3 className='text-gray-200 text-center md:text-left text-sm py-3'>Already have an account? <span className='text-blue-300'> <Link to={'/login'}>Login and continue</Link> </span></h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
