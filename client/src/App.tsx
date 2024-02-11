import React, { useContext } from 'react'
import { Context } from './Configs/ContextProvider'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import RestrictedPublicRoute from './Configs/RestrictedPublicRoute'
import Dashboard from './pages/Dashboard/Dashboard'
import DefaultHome from './components/DefaultHome/DefaultHome'
import Chat from './components/Chat/Chat'
import PrivateRoute from './Configs/PrivateRoute'
import AddFriend from './components/AddFriend/AddFriend'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import FriendRequests from './components/FriendRequests/FriendRequests'
import Friends from './components/Firends/Firends'
import SentRequests from './components/SentRequests/SentRequests'
import axios from 'axios'
import Chats from './components/Chats/Chats'
type Props = {}

const App = (props: Props) => {


  // Create an instance of axios with a baseURL

  axios.defaults.baseURL = `http://localhost:3000/`



  const router = createBrowserRouter([
    {
      path: '/',
      element: <RestrictedPublicRoute><Login /></RestrictedPublicRoute>,
      errorElement: <NotFoundPage />,

    },
    {
      path: '/dashboard/',
      element: <PrivateRoute> <Dashboard /></PrivateRoute>,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: '/dashboard/',
          element: <DefaultHome />
        },
        {
          path: '/dashboard/chat',
          element: <Chat />
        },
        {
          path: '/dashboard/add-friend',
          element: <AddFriend />
        },
        {
          path: '/dashboard/friend-requests',
          element: <FriendRequests />
        },
        {
          path: '/dashboard/friends',
          element: <Friends />
        },
        {
          path: '/dashboard/sent-requests',
          element: <SentRequests />
        },
        {

          path: '/dashboard/chat/:chatId',
          element: <Chat></Chat>
        },
        {

          path: '/dashboard/chats/',
          element: <Chats />
        },
      ]
    },
    {
      path: '/login',
      element: <RestrictedPublicRoute><Login /></RestrictedPublicRoute>,
      errorElement: <>404 page</>
    },
    {
      path: '/register',
      element: <RestrictedPublicRoute><Register /></RestrictedPublicRoute>,
      errorElement: <>404 page</>
    },
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App