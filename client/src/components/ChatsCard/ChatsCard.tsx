
import React, { useContext, useEffect, useState } from 'react'
import { MongoUser } from '../../types/types';
import axios from 'axios';
import { Context } from '../../Configs/ContextProvider';
import toast from 'react-hot-toast';
import { VscLoading } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

type Props = {
    chat: any,

}

const ChatsCard = ({ chat }: Props) => {

    const { user } = useContext(Context)!


    const [loading, setLoading] = useState(false)
    const [loadingCancel, setLoadingCancel] = useState(false)
    const [user2, setUser2] = useState<MongoUser | null>(null)

const navigate = useNavigate()

    const otherUser = chat.users.filter((fetchedUser: String) => fetchedUser !== user?.email)
    const chatfunc = async () => {
        navigate('/dashboard/chat/'+chat._id)
        
    }






    useEffect(() => {
        axios.get(`/get-single-user?email=${otherUser}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('chat-app')}`
            }
        })
            .then(res => {
                setUser2(res.data.user)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            }
            )

    }, [])



  





    return (
        <div className='flex items-center justify-between border-t py-2'>
            <div className="basis-1/2 flex gap-2">
                <div style={{ backgroundImage: `url('${user2?.photoURL}')` }} className='w-[50px] overflow-hidden rounded-full h-[50px] hover:scale-[5] md:hover:scale-[3] md:hover:ms-[-110px] md:hover:me-[100px]  hover:translate-x-24 transition-all ease-in-out duration-300 border  border-gray-300 flex justify-center items-center bg-cover bg-center'>
                    {/* <img src={image ? image : ''} className='w-full ' alt={name ? name : ''} /> */}

                </div>
                <div className="">
                    <h3 className='text-gray-500 text-lg'>{user2?.name}</h3>
                    <h3 className='text-gray-500 text-xs'>{user2?.email}</h3>
                </div>
            </div>

            <div className="basis-1/2">

                <button onClick={chatfunc} className='bg-[#4566d1] me-2 text-white px-2 py-1 rounded float-end hover:scale-105 transition-all text-xs ease-in-out duration-300 hover:shadow-lg'>{loading ? <><VscLoading className='inline text-lg animate-spin' /> </> : <>  Continue Chatting <FaArrowRight className='inline' /> </>}</button>
            </div>

        </div>
    )
}

export default ChatsCard
