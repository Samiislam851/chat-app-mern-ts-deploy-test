import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { Context } from './ContextProvider'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'
import { MongoUser } from '../types/types'
import Sound from '../assets/notification.mp3'
import Tic from '../assets/facebook_chat_pop.mp3'
interface Props {
    children: ReactNode
}



interface Message {
    _id: string,
    chatId: string,
    sender: string,
    content: string,
    timeStamp: Date,
}



interface valueType {
    socket: WebSocket | Socket | null | any,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    onlineUsers: string[] | null,
    setRequestedPersons: React.Dispatch<React.SetStateAction<MongoUser[]>>,
    requestedPersons: MongoUser[],
    setChats: React.Dispatch<React.SetStateAction<any[]>>,
    chats: any[],
    setTypingData: React.Dispatch<React.SetStateAction<{
        user: string;
        typing: boolean;
    }>>,
    typingData: {
        user: string;
        typing: boolean;
    }
}



export const SocketContext = createContext<valueType | null>(null)

const SocketContextProvider = ({ children }: Props) => {




    const notificationAudio = new Audio(Sound)
    const ticSound = new Audio(Tic);

    const { user, requests, setRequests } = useContext(Context)!

    const [socket, setSocket] = useState<WebSocket | Socket | null | any>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [onlineUsers, setOnlineUsers] = useState<string[] | null>(null)
    const [requestedPersons, setRequestedPersons] = useState<MongoUser[]>([])
    const [chats, setChats] = useState<any[]>([])
    const [typingData, setTypingData] = useState({ user :'',typing:false})


    useEffect(() => {
        if (user) {

            const newSocket = io('http://localhost:3000/', { query: { user: user?.email } })
            newSocket.on('connect', () => {
                newSocket?.on('getOnlineUsers', (onlineUsers: string[]) => {
                    setOnlineUsers(onlineUsers)
                })
                setSocket(newSocket)

                console.log('connected to socket server -->', newSocket);
                // socket.on('typing', () => setsTyping(true))

                // socket.on('stop typing', () => setsTyping(false))

            })



            return () => {
                newSocket.disconnect()
                setSocket(null)
            }
        }
    }, [user])




    useEffect(() => {
        socket?.on("message-received", (newMessageReceived: any) => {
            //checking if the message is for this chat 

            if (!window.location.href.includes(newMessageReceived.message.chatId)) {

                console.log(newMessageReceived);

                const chatItem = {
                    chat: {
                        _id: newMessageReceived.chat.chatId,
                        chatName: '',
                        lastMessage: {
                            content: newMessageReceived.message.content,
                            sender: newMessageReceived.message.sender,
                            timeStamp: newMessageReceived.message.timeStamp
                        }
                    },
                    users: newMessageReceived.chat.users,
                    _id: newMessageReceived.chat.chatId,
                    email: newMessageReceived.message.sender,
                    name: newMessageReceived.senderName,
                    photoURL: newMessageReceived.senderPhoto,
                    userId: newMessageReceived.message.sender
                }


                setChats((prevChats: any) => {

                    console.log('prev Chat ====>', prevChats);
                    const newChats = prevChats.filter((chat: any) => chat.chat._id !== chatItem._id)
                    console.log('new chats after filter', newChats);

                    newChats!.unshift(chatItem);

                    return newChats




                });

                notificationAudio.play()
                toast(`${newMessageReceived.senderName} sent : ${newMessageReceived.message.content}`)
            } else {

                ticSound.play()
                if (!messages.some(message => message._id == newMessageReceived.message._id)) {
                    setMessages((prevMessages) => [...prevMessages, newMessageReceived.message])
                }



            }

        })




        socket?.on('getOnlineUsers', (onlineUsers: string[]) => {
            setOnlineUsers(onlineUsers)
        })



        socket?.on('request accepted res', (user: any) => {

            notificationAudio.play()
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${user.name} just accepted your request`,
                showConfirmButton: false,
                timer: 1500
            });


            const otherPersons = requestedPersons.filter(person => person.email == user.email)
            setRequestedPersons(otherPersons)
        })

        socket?.on('send request res', (user: any) => {

            notificationAudio.play()
            Swal.fire({
                position: "top-end",
                icon: "info",
                title: `${user.name} sent you a request`,
                showConfirmButton: false,
                timer: 1500
            });
            if (requests) {
                setRequests(prev => prev ? [...prev, user.email] : [user.email])
            }
        })



        socket?.on('typing', (data: any) => {
            console.log('typing ....', data);
            setTypingData(data)
        })
        socket?.on('typing stopped', (data: any) => {
            console.log('typing stopped', data);
            setTypingData(data)
        })


        return () => {
            socket?.disconnect()
        }
    }, [socket])




    const value: valueType = {
        socket, messages, setMessages, onlineUsers, setRequestedPersons, requestedPersons, chats, setChats, typingData, setTypingData
    }
    return (
        <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
    )
}

export default SocketContextProvider