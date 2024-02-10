import React, { ReactNode, useContext } from 'react'
import { Context } from './ContextProvider'
import { Navigate } from 'react-router-dom'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

type Props = {
    children: ReactNode
}


const PrivateRoute = ({ children }: Props) => {

    const { user, loading } = useContext(Context)!
    if (!loading) {
        return (
            <> {!user ? <Navigate to='/login' /> : <>{children}</>}</>
        )
    }
    return <> <div className='w-screen my-40'> <AiOutlineLoading3Quarters className='text-5xl text-center animate-spin mx-auto' />
    
    
    </div></>

}

export default PrivateRoute