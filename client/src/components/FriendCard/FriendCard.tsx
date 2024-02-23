
import React, { useContext, useEffect, useState } from 'react'
import { MongoUser } from '../../types/types';
import axios from 'axios';
import { Context } from '../../Configs/ContextProvider';
import toast from 'react-hot-toast';
import { VscLoading } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../Configs/SocketContextProvider';

type Props = {
    friend: MongoUser,
    friends: MongoUser[],
    dbUser: MongoUser | null,
    setDbUser: React.Dispatch<React.SetStateAction<MongoUser | null>>,
    setFriends: React.Dispatch<React.SetStateAction<MongoUser[] | null>>
}

const FriendCard = ({ friend, dbUser, setDbUser, setFriends, friends }: Props) => {


    console.log('.,...dADVASDVA.S D.......', dbUser);

    const { user, logOut } = useContext(Context)!

    // Update the destructure to use searchUser
    const { photoURL, name, _id, email } = friend;
    const [loading, setLoading] = useState(false)
    const [loadingCancel, setLoadingCancel] = useState(false)

    const navigate = useNavigate()
    const { onlineUsers, socket } = useContext(SocketContext)!
    const [isOnline, setIsOnline] = useState<boolean>(false)



    useEffect(() => {
        if (onlineUsers?.includes(email)) setIsOnline(true)
        else setIsOnline(false)

        console.log('is online = ', isOnline);

    }, [onlineUsers, socket])



    const chat = () => {
        axios.get(`/chat/${user?.email}--${email}`, { headers: { Authorization: `Bearer ${localStorage.getItem('chat-app')}` } }).then(res => {


            navigate(`/dashboard/chat/${res.data.chatId}`)
        }).catch(err => {


            console.log(err)

            if (err.response.status === 401) {
                logOut()
            }
        })


    }













    return (
        <div className='flex items-center justify-between border-t border-gray-500 bg-white bg-opacity-15 border-s  p-2 backdrop-blur-[3px] rounded-lg mt-2  transition-all ease-in-out  duration-300  '>
            <div className="basis-1/2 flex gap-2">
                <div style={{ backgroundImage: `url('${photoURL}')` }} className={` w-[50px] hover:z-50 overflow-hidden rounded-full h-[50px]  transition-all ease-in-out duration-300 border border-gray-300 flex justify-center items-center bg-cover bg-center `}>
                    {/* <img src={image ? image : ''} className='w-full ' alt={name ? name : ''} /> */}

                </div>
                <div className="">
                    <div className='flex items-center gap-1 justify-start'>
                        <h3 className='text-gray-300 text-lg'>{name}  </h3>
                        <div title={isOnline ? ' user is Online ' : ''} className={`${isOnline ? 'p-1 rounded-full mt-1 bg-green-500 ' : ''} `}></div>
                    </div>

                    <h3 className='text-gray-300 text-xs'>{email}</h3>
                </div>
            </div>

            <div className="basis-1/2">



                <button onClick={chat} className='bg-[#5c3ba2] me-2 text-white px-3 py-1 rounded float-end hover:scale-105 transition-all ease-in-out duration-300 hover:shadow-lg'>{loading ? <><VscLoading className='inline text-lg animate-spin' /> </> : <>  Chat </>}</button>




            </div>

        </div>
    )
}

export default FriendCard
