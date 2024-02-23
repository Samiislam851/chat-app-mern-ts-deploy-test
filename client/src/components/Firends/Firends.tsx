
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Context } from '../../Configs/ContextProvider';
import { MongoUser } from '../../types/types';

import FriendCard from '../FriendCard/FriendCard';


type Props = {}
type inputObject = {
    input: string
}



const Friends = (props: Props) => {




    const { user, logOut } = useContext(Context)!
    const [loading, setLoading] = useState<boolean>(false)

    const [friends, setFriends] = useState<MongoUser[] | null>(null)




    // console.log(searchedUsers);
    const [dbUser, setDbUser] = useState<MongoUser | null>(null)
    useEffect(() => {

        if (user) {
            setLoading(true)
            axios.get(`/get-friends?email=${user?.email}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('chat-app')}`
                }
            })
                .then(res => {


                    setFriends(res.data.users)
                    setLoading(false)

                })
                .catch(err => {

                    setLoading(false)
                    console.log(err)
                    if (err.response.status === 401) {
                        logOut()
                    }
                }
                )
        }

    }, [])






    return (
        <div className='py-20 px-2'>



            {loading ?

                <div className='w-full flex justify-center items-center py-20'>
                    <AiOutlineLoading3Quarters className='animate-spin text-6xl text-gray-600' />

                </div>
                :



                <div className='max-w-md  mx-auto'>

                    <h3 className='text-xl text-[#FFFFFF] pb-1'>Friends </h3>
                    <div className='border-t pt-2  '>


                        {
                            !friends ? <div className='text-xl text-center py-10 text-gray-500'>
                                No friends. Make some to start chatting
                            </div>
                                :


                                <ul className='list-none '>
                                    {


                                        /////////////////// create an array of requested users then show them here

                                        friends?.map((friend: MongoUser, i: number) => <FriendCard key={i} dbUser={dbUser} setDbUser={setDbUser} friends={friends} setFriends={setFriends} friend={friend} />)
                                    }

                                </ul>
                        }
                    </div>
                </div>





            }




        </div >




    )
}

export default Friends