import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../Configs/ContextProvider'
import { IoIosLogOut } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { IoChatboxEllipsesOutline, IoPersonAddOutline, IoPersonOutline } from 'react-icons/io5'
import { BsPeopleFill } from 'react-icons/bs'
import { FaArrowRight } from 'react-icons/fa'

type Props = {}

const SideBar = (props: Props) => {

    const { user, logOut, loading } = useContext(Context)!
    console.log(user);
    const logOutFunc = async () => {
        if (logOut) {

            await logOut()
        }
    }



    return (
        <div className="flex flex-col max-w-sm h-screen border-e-2 ">
            {/* Top */}
            <div className="flex justify-start px-2 py-2 gap-2 items-center">

                <h3 className='text-gray-700 text-2xl font-bold'>ChitChatZ</h3>
            </div>

            {/* Middle */}
            <div className="flex-1 overflow-y-auto flex flex-col ">

                <div className="basis-1/2 border-t-2 px-3">
                    <h4 className='text-sm text-gray-500 font-medium' >Options</h4>
                    <Link to='/dashboard/chats' className='flex justify-start gap-2 text-base items-center text-gray-600 font-base  pt-2'>

                        <div className='border-2 rounded-md p-1'>
                        <IoChatboxEllipsesOutline />
                        </div>
                        <span>Chats</span>
                    </Link>
                    <Link to='/dashboard/add-friend' className='flex justify-start gap-2 text-base items-center text-gray-600 font-base  pt-2'>

                        <div className='border-2 rounded-md p-1'>
                            <IoPersonAddOutline />
                        </div>
                        <span>Add Friend</span>
                    </Link>
                    <Link to='/dashboard/friend-requests' className='flex justify-start gap-2 text-base items-center text-gray-600 font-base  pt-2'>

                        <div className='border-2 rounded-md p-1'>
                            <IoPersonOutline />
                        </div>
                        <span>Friend Requests</span>
                    </Link>
                    <Link to='/dashboard/friends' className='flex justify-start gap-2 text-base items-center text-gray-600 font-base  pt-2'>

                        <div className='border-2 rounded-md p-1'>
                            <BsPeopleFill />
                        </div>
                        <span>My Friends</span>
                    </Link>
                    <Link to='/dashboard/sent-requests' className='flex justify-start gap-2 text-base items-center text-gray-600 font-base  pt-2'>

                        <div className='border-2 rounded-md p-1'>
                            <FaArrowRight />
                        </div>
                        <span>Sent Requests</span>
                    </Link>

                </div>



            </div>

            {/* Bottom */}
            <div className="px-3 py-5">
                <div className="flex w-full gap-3 justify-between items-center text-gray-700">

                    <div className='basis-[20%]'>


                        <div
                            style={{ backgroundImage: `url(${user?.photoURL})` }}
                            className="md:w-14 md:h-14 bg-cover bg-center rounded-full "
                        >
                            {/* <img src={user?.photoURL!} className="w-full h-full" alt="" /> */}
                        </div>
                    </div>
                    <div className='basis-[60%]'>
                        <h3 className='text-xl font-medium'>{user?.displayName!}</h3>
                        <h4 className='text-sm text-gray-500'>{user?.email}</h4>
                    </div>
                    <button className="text-white basis-[20%]" title='Log Out' onClick={logOutFunc}>
                        <IoIosLogOut className="w-8 h-8 text-red-600" />
                    </button>
                </div>
            </div>
        </div>

    )
}

export default SideBar