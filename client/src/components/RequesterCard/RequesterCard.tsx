
import React, { useContext, useState } from 'react'
import { MongoUser } from '../../types/types';
import axios from 'axios';
import { Context } from '../../Configs/ContextProvider';
import toast from 'react-hot-toast';
import { VscLoading } from 'react-icons/vsc';
import SentRequests from '../SentRequests/SentRequests';
import { SocketContext } from '../../Configs/SocketContextProvider';

type Props = {
    requester: MongoUser,
    requesters: MongoUser[],
    dbUser: MongoUser | null,
    setDbUser: React.Dispatch<React.SetStateAction<MongoUser | null>>,
    setRequesters: React.Dispatch<React.SetStateAction<MongoUser[] >>,
}

const RequesterCard = ({ requester, dbUser, setDbUser, setRequesters, requesters, }: Props) => {




    const { user, logOut, setRequests } = useContext(Context)!

    const { socket } = useContext(SocketContext)!
    // Update the destructure to use searchUser
    const { photoURL, name, _id, email } = requester;
    const [loading, setLoading] = useState(false)
    const [loadingCancel, setLoadingCancel] = useState(false)



    const accept = async () => {

        try {
            setLoading(true)
            const res = await axios.post(`/accept-request?user1email=${user?.email}&&user2email=${email}`, { user }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('chat-app')}`
                }
            })

            if (res.status == 200) {



                const otherRequesters = requesters.filter(requester => requester.email !== email)
                setRequesters(otherRequesters)
                setRequests(otherRequesters)
                const data = { user1: user?.email, user1name: user?.displayName, user2Email: email }
                socket.emit('request accepted',  data )
                toast.success(res.data.message);

            }



        } catch (error: any) {
            console.log(error);
            if (error.response.status === 401) {
                logOut()
            }

        } finally {
            setLoading(false)
        }

    }


    const cancelRequest = async () => {
        try {
            setLoadingCancel(true)
            const res = await axios.post(`/cancel-request?user1email=${user?.email}&&user2email=${email}`, { user }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('chat-app')}`
                }
            })

            if (res.status == 200) {
                toast.success(res.data.message);
                const otherRequesters = requesters.filter(requester => requester.email !== email)
                setRequesters(otherRequesters)
                setRequests(otherRequesters)
            }



        } catch (error: any) {
            console.log(error);

            if (error.response.status == 401) logOut()

        } finally {
            setLoadingCancel(false)
        }



    }












    return (
        <div className='flex items-center justify-between border-t border-gray-500 bg-white bg-opacity-15 border-s  p-2 backdrop-blur-[2px]  rounded-lg mt-2   transition-all ease-in-out  duration-300 '>
            <div className="basis-1/2 flex gap-2">
                <div style={{ backgroundImage: `url('${photoURL}')` }} className='w-[50px] overflow-hidden rounded-full h-[50px]  transition-all ease-in-out duration-300 border  border-gray-300 flex justify-center items-center bg-cover bg-center'>
                    {/* <img src={image ? image : ''} className='w-full ' alt={name ? name : ''} /> */}

                </div>
                <div className="">
                    <h3 className='text-gray-200 text-lg'>{name}</h3>
                    <h3 className='text-gray-200 text-xs'>{email}</h3>
                </div>
            </div>

            <div className="basis-1/2">
                <button onClick={cancelRequest} className='bg-[#da3b3b] text-white px-3 py-1 rounded float-end hover:scale-105 transition-all ease-in-out duration-300 hover:shadow-lg'>{loadingCancel ? <><VscLoading className='inline text-lg animate-spin' /> </> : <> Cancel</>}</button>

                <button onClick={accept} className='bg-[#5c3ba2] me-2 text-white px-3 py-1 rounded float-end hover:scale-105 transition-all ease-in-out duration-300 hover:shadow-lg'>{loading ? <><VscLoading className='inline text-lg animate-spin' /> </> : <>  Accept </>}</button>
            </div>

        </div>
    )
}

export default RequesterCard
