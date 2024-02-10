
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { CiSearch } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Context } from '../../Configs/ContextProvider';
import { MongoUser } from '../../types/types';
import SearchedPeopleCard from '../SearchedPeopleCard/SearchedPeopleCard';


type Props = {}
type inputObject = {
    input: string
}



const AddFriend = (props: Props) => {

    const { register, handleSubmit } = useForm<inputObject>()


    const { user, logOut } = useContext(Context)!
    const [loading, setLoading] = useState<boolean>(false)
    const [searchedUsers, setSearchedUsers] = useState<MongoUser[]>([])
    const [searched, setSearched] = useState<boolean>(false)



    const searchPeople = async (data: inputObject) => {




        const inputValue: string = data.input

        if (data.input == '' || data.input == ' ') {
            toast.error(' Please Enter something ')
        } else {

            setLoading(true)
            axios.post('http://localhost:3000/search-user',
                { inputValue, user },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('chat-app')}`
                    }
                }
            ).then(res => {
                setLoading(false)
                setSearched(true)
                setSearchedUsers(res.data.users)
            }
            ).catch(err => {

                setLoading(false)
                console.log(err)
                if (err.response.status === 401) {
                    logOut()
                }

            })



        }


    }


    // console.log(searchedUsers);
    const [dbUser, setDbUser] = useState<MongoUser | null>(null)
    useEffect(() => {

        axios.get(`http://localhost:3000/get-single-user?email=${user?.email}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('chat-app')}`
            }
        })
            .then(res => setDbUser(res.data.user))
            .catch(err => console.log(err)
            )

    }, [])






    return (
        <div>
            <form className='max-w-md mx-auto pt-10 pb-5   ' onSubmit={handleSubmit(searchPeople)}>

                <div className="flex flex-col md:flex-row py-2  justify-center items-center gap-2 overflow-hidden ">
                    <input {...register('input')}
                        type="text"
                        placeholder="you@email.com or name"
                        className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                    <button className="px-4 py-2 bg-[#81689D] transition-all ease-in-out duration-300 text-white rounded-md hover:bg-[#365486] focus:bg-[#365486d2] focus:outline-none flex items-center w-fit scale-95">
                        <CiSearch /> <span>Search</span>
                    </button>
                </div>


            </form>


            {loading ? <>

                <div className='w-full flex justify-center items-center py-20'>
                    <AiOutlineLoading3Quarters className='animate-spin text-6xl text-gray-600' />

                </div>


            </> : <> {searched ? <>
                {searchedUsers[0] ? <>
                    <div className='max-w-md  mx-auto'>

                        <h3 className='text-sm text-[#81689D] pb-1'>Search Result : </h3>
                        <div className='border-t pt-0'>


                            <ul className='list-none '>
                                {
                                    searchedUsers.map((searchedUser: MongoUser, i) => <SearchedPeopleCard key={i} dbUser={dbUser}  setDbUser={setDbUser}  searchUser={searchedUser} />)
                                }

                            </ul>
                        </div>
                    </div>





                </> : <>

                    <h3 className=' pt-10  text-center text-red-500'> <span>No user found with this name :(</span></h3>


                </>}
            </> : <>

                <h3 className='text-xl text-[#365486] opacity-70 py-20 text-center'>Search someone to add as a friend!</h3>

            </>}</>}




        </div>
    )
}

export default AddFriend