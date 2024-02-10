import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../../components/SideBar/SideBar'

type Props = {}

const Dashboard = (props: Props) => {
    return (
        <div className='flex w-screen'>

            <div className="">
               <SideBar/>
            </div>

            <div className="flex-grow">

                <Outlet />

            </div>
        </div>
    )
}

export default Dashboard