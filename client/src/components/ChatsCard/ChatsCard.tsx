
import React, { useContext, useEffect, useState } from 'react'
import { MongoUser } from '../../types/types';
import axios from 'axios';
import { Context } from '../../Configs/ContextProvider';
import toast from 'react-hot-toast';
import { VscLoading } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { SocketContext } from '../../Configs/SocketContextProvider';

type Props = {
    chat: any,

}

const ChatsCard = ({ chat }: Props) => {

    const { user } = useContext(Context)!
    console.log(chat);


    const [loading, setLoading] = useState(false)
    // const [loadingCancel, setLoadingCancel] = useState(false)
    // const [user2, setUser2] = useState<MongoUser | null>(chat.)

    const navigate = useNavigate()

    // const otherUser = chat.users.filter((fetchedUser: String) => fetchedUser !== user?.email)
    const chatfunc = async () => {
        navigate('/dashboard/chat/' + chat.chat._id)

    }


    const { onlineUsers, socket, typingData } = useContext(SocketContext)!
    const [isOnline, setIsOnline] = useState<boolean>(false)



    useEffect(() => {
        if (onlineUsers?.includes(chat.email)) setIsOnline(true)
        else setIsOnline(false)

        console.log('is online = ', isOnline);

    }, [onlineUsers, socket])



   






    // const date = new Date(chat?.chat.lastMessage.timeStamp)





    return (
        <div onClick={chatfunc}  className='cursor-pointer flex items-center justify-between border-t border-gray-500 bg-white bg-opacity-15 border-s  p-2 backdrop-blur-[2px]  rounded-lg mt-2   transition-all ease-in-out  duration-300 group '>
            <div className="basis-1/2 flex gap-2">
                <div style={{ backgroundImage: `url('${chat?.photoURL}')` }} className='w-[50px] overflow-hidden rounded-full h-[50px]     transition-all ease-in-out duration-300 border  border-gray-300 flex justify-center items-center bg-cover bg-center'>
                    {/* <img src={image ? image : ''} className='w-full ' alt={name ? name : ''} /> */}

                </div>
                <div className="">
                    <div className='flex items-center gap-1 justify-start'>
                        <h3 className='text-gray-300 text-lg'>{chat?.name}  </h3>
                        <div title={isOnline ? ' user is Online ' : ''} className={`${isOnline ? 'p-1 rounded-full mt-1 bg-green-500 ' : ''} `}></div>
                    </div>
                    {chat?.chat?.lastMessage?.sender&&       <h3 className='text-gray-300 font-thin text-xs'>{chat?.chat?.lastMessage?.sender == user?.email ? 'You' : `${chat.name}`} :  {chat?.chat.lastMessage.content.substring(0, 15)}</h3>}
             
                </div>
            </div>

            <div className="basis-1/2">
                <div className='flex flex-col group justify-end items-end gap-2 '>
                    <div className='text-[#4566d1] text-gray-300 px-2 py-1 rounded float-end transition-all  font-thin ease-in-out duration-300 mb-2 group-hover:translate-x-2 group-hover:scale-105 text-sm'>{loading ? <><VscLoading className='inline text-lg animate-spin' /> </> : <> <span>Continue Chatting</span>  <FaArrowRight className='inline' /> </>}</div>
                </div>

            </div>

        </div>
    )
}

export default ChatsCard
