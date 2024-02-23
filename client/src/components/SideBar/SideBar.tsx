import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../Configs/ContextProvider'
import { IoIosLogOut, IoMdClose } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { IoChatboxEllipsesOutline, IoHome, IoPersonAddOutline, IoPersonOutline } from 'react-icons/io5'
import { BsPeopleFill } from 'react-icons/bs'
import { FaArrowRight } from 'react-icons/fa'

type Props = {
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SideBar = ({ setSidebarOpen }: Props) => {

    const { user, logOut, loading, requests } = useContext(Context)!
    console.log(user);
    const logOutFunc = async () => {
        if (logOut) {

            await logOut()
        }
    }



    return (
        <div className="flex flex-col max-w-sm h-screen border-e border-opacity-50  border-gray-500 bg-transparent">
            {/* Top */}
            <div className="flex justify-between px-2 py-2 gap-2 items-center">

                <h3 className='text-gray-100 -700 text-2xl font-bold'>ChitChatZ</h3>

                <div onClick={() => setSidebarOpen(false)} className='cursor-pointer  md:hidden text-xl pe-2'><IoMdClose /></div>
            </div>

            {/* Middle */}
            <div className="flex-1 overflow-y-auto flex flex-col ">

                <div className="basis-1/2  border-t pt-2 border-gray-500 px-3 border-opacity-50 ">
                    <h4 className='text-sm text-gray-00 -500 font-medium' >Options</h4>
                    <Link onClick={() => setSidebarOpen(false)} to='/dashboard/' className='flex justify-start gap-2  text-base items-center text-gray-00 -600 font-base  pt-2 mt-1'>

                        <div className='border rounded-md p-1'>
                            <IoHome />
                        </div>
                        <span>Home</span>
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} to='/dashboard/chats' className='flex justify-start gap-2  text-base items-center text-gray-00 -600 font-base  pt-2 mt-1'>

                        <div className='border rounded-md p-1'>
                            <IoChatboxEllipsesOutline />
                        </div>
                        <span>Chats</span>
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} to='/dashboard/add-friend' className='flex justify-start gap-2  text-base items-center text-gray-00 -600 font-base  pt-2 mt-1'>

                        <div className='border rounded-md p-1'>
                            <IoPersonAddOutline />
                        </div>
                        <span>Add Friend</span>
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} to='/dashboard/friend-requests' className='flex justify-start gap-2  text-base items-center text-gray-00 -600 font-base  pt-2 mt-1'>

                        <div className='border rounded-md p-1'>
                            <IoPersonOutline />
                        </div>
                        <span>Friend Requests</span>
                        {requests && requests?.length > 0 ? <div className='mt-1 ms-[-3px] text-xs w-4 h-4 text-center rounded-full bg-red-500 text-white'>{requests?.length}</div> : <></>}

                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} to='/dashboard/friends' className='flex justify-start gap-2  text-base items-center text-gray-00 -600 font-base  pt-2 mt-1'>

                        <div className='border rounded-md p-1'>
                            <BsPeopleFill />
                        </div>
                        <span>My Friends</span>
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} to='/dashboard/sent-requests' className='flex justify-start gap-2  text-base items-center text-gray-00 -600 font-base  pt-2 mt-1'>

                        <div className='border rounded-md p-1'>
                            <FaArrowRight />
                        </div>
                        <span>Sent Requests</span>
                    </Link>

                </div>



            </div>

            {/* Bottom */}
            <div className="px-2 py-3">
                <div className="flex w-full gap-3 justify-between items-center text-gray-00 shadow-xl bg-white bg-opacity-10 px-2 py-2 rounded-lg border-t border-gray-500 border-opacity-50">

                    <div className='basis-[20%]'>


                        <div
                            style={{ backgroundImage: `url(${user?.photoURL})` }}
                            className="w-14 h-14 bg-cover bg-center rounded-full "
                        >
                            {/* <img src={user?.photoURL!} className="w-full h-full" alt="" /> */}
                        </div>
                    </div>
                    <div className='basis-[60%]'>
                        <h3 className='text-xl font-medium'>{user?.displayName!}</h3>
                        <h4 className='text-sm text-gray-00 -500'>{user?.email}</h4>
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