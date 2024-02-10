import React, { ReactNode, useContext } from 'react'
import { Context } from './ContextProvider'
import { Navigate } from 'react-router-dom'

type Props = {
    children: ReactNode
}


const RestrictedPublicRoute = ({ children }: Props) => {

    const { user } = useContext(Context)!

    return (
        <> {user ? <Navigate to='/dashboard' /> : <>{children}</>}</>
    )
}

export default RestrictedPublicRoute