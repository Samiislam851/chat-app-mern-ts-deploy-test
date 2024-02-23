
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Context } from '../../Configs/ContextProvider';
import { MongoUser } from '../../types/types';
import ChatsCard from '../ChatsCard/ChatsCard';
import { SocketContext } from '../../Configs/SocketContextProvider';


type Props = {}
type inputObject = {
    input: string
}
interface LastMessage {
    _id: string;
    chatId: string;
    sender: string;
    content: string;
    timeStamp: string; // Assuming timeStamp is a string representing a date
}

interface Chat {
    chat: {
        lastMessage: LastMessage;
        // Other properties of the chat object
    };
    // Other properties of the chat object
}

const Chats = (props: Props) => {




    const { user, logOut } = useContext(Context)!
    const { chats, setChats } = useContext(SocketContext)!

    const [loading, setLoading] = useState<boolean>(false)






    // console.log(searchedUsers);
    const [dbUser, setDbUser] = useState<MongoUser | null>(null)
    useEffect(() => {
        setLoading(true)
        axios.get(`/get-chats?email=${user?.email}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('chat-app')}`
            }
        })
            .then(res => {

                console.log('res.data.chats', res.data.chatsFinal);
                const chatsTemp = res.data.chatsFinal

                console.log('chatsTemp : ', chatsTemp);

                chatsTemp.sort((chat1: Chat, chat2: Chat) => {
                    // Access the timestamp of the last message in each chat
                    const timestamp1: any = new Date(chat1.chat.lastMessage.timeStamp);
                    const timestamp2: any = new Date(chat2.chat.lastMessage.timeStamp);

                    console.log('timestamps : ', timestamp1, timestamp2);


                    return timestamp2 - timestamp1;
                });


                console.log('chatsTemp after: ', chatsTemp);


                setChats(chatsTemp)
                setLoading(false)

            })
            .catch(err => {

                setLoading(false)
                if (err.response.status === 401) {
                    logOut()
                }
                console.log(err)

            }
            )

    }, [])


    console.log(chats);





    return (
        <div className='py-20 px-2'>
            {loading ?
                <div className='w-full flex justify-center items-center py-20 '>
                    <AiOutlineLoading3Quarters className='animate-spin text-6xl text-gray-600' />
                </div>
                :



                <div className='max-w-md  mx-auto'>

                    <h3 className='text-2xl text-center text-[#FFFFFF] pb-1'>Chat history </h3>
                    <div className='border-t pt-0'>

                        {!chats ? <div className='text-xl text-center py-10 text-gray-500'>
                            No Chats
                        </div> :
                            <ul className='list-none '>
                                {
                                    
                                    /////////////////// create an array of requested users then show them here

                                    chats?.map((chat: object | null, i: number) => <ChatsCard key={i} chat={chat} />)
                                }

                            </ul>
                        }
                    </div>
                </div>





            }
        </div >
    )
}

export default Chats