
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Context } from '../../Configs/ContextProvider';
import { MongoUser } from '../../types/types';
import ChatsCard from '../ChatsCard/ChatsCard';


type Props = {}
type inputObject = {
    input: string
}



const Chats = (props: Props) => {




    const { user, logOut } = useContext(Context)!
    const [loading, setLoading] = useState<boolean>(false)

    const [chats, setChats] = useState<any[] | null>(null)




    // console.log(searchedUsers);
    const [dbUser, setDbUser] = useState<MongoUser | null>(null)
    useEffect(() => {
        setLoading(true)
        axios.get(`/get-chats?email=${user?.email}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('chat-app')}`
            }
        })
            .then(res => {

                console.log('res.data.chats', res.data.chats);

                setChats(res.data.chats)
                setLoading(false)

            })
            .catch(err => {

                setLoading(false)
                console.log(err)
            }
            )

    }, [])






    return (
        <div className='py-20'>



            {loading ?

                <div className='w-full flex justify-center items-center py-20'>
                    <AiOutlineLoading3Quarters className='animate-spin text-6xl text-gray-600' />

                </div>
                :



                <div className='max-w-md  mx-auto'>

                    <h3 className='text-2xl text-center text-[#81689D] pb-1'>Chat history </h3>
                    <div className='border-t pt-0'>

                        {!chats ? <div className='text-xl text-center py-10 text-gray-500'>
                            No Chats
                        </div> :
                            <ul className='list-none '>
                                {


                                    /////////////////// create an array of requested users then show them here

                                    chats?.map((chat: MongoUser, i: number) => <ChatsCard key={i} chat={chat} />)
                                }

                            </ul>
                        }
                    </div>
                </div>





            }




        </div >




    )
}

export default Chats