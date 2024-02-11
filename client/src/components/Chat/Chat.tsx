import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Context } from '../../Configs/ContextProvider'
import { MongoUser } from '../../types/types'
import { IoMdArrowBack } from 'react-icons/io'
import { io } from "socket.io-client";
import Swal from 'sweetalert2'


interface Props { }
interface inputObject {
  message: string,
}
interface Message {
  _id: string,
  chatId: string,
  sender: string,
  content: string,
  timeStamp: Date,
}
const Chat = (props: Props) => {





  const { chatId } = useParams()
  const { user, } = useContext(Context)!
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [secondUser, setSecondUser] = useState<MongoUser | null>(null)

  const [socketConnected, setSocketConnected] = useState<boolean>(false)
  const [socket, setSocket] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const [typing, setTyping] = useState(false)
  const [isTyping, setsTyping] = useState(false)



  const { register, handleSubmit, reset } = useForm<inputObject>();


  //////////////////// add socket connection  ///////

  useEffect(() => {


    const newSocket = io("/");

    newSocket.on('connect', () => {
      setSocketConnected(true)
      setSocket(newSocket)
      // socket.on('typing', () => setsTyping(true))

      // socket.on('stop typing', () => setsTyping(false))

      console.log('Connected to socket server');
    }
    )
    newSocket.emit('setup', user);

    return () => {
      newSocket.disconnect();
    };
  }, []);


  /////////////////////// fetching data logic //////////////

  useEffect(() => {
    setLoading(true)
    axios.get(`/messages/${chatId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('chat-app')}` } })

      .then(res => {

        setMessages(res.data)

        socket?.emit('join-chat', chatId)
        setLoading(false)
      })

      .catch(err => {
        setLoading(false)
        console.log(err)
      })
  }, [])



  useEffect(() => {
    const secondUsersMessage = messages?.find(chatUser => chatUser?.sender != user?.email)
    const user2Email = secondUsersMessage?.sender

    axios.get(`/get-single-user?email=${user2Email}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('chat-app')}`
      }
    })
      .then(res => {
        setSecondUser(res.data.user)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      }
      )

  }, [messages])

  //////////////////////// send message function////////
  const onSubmit = async (data: inputObject) => {
    try {

      const res = await axios.post(
        `/send-message/${chatId}`,
        {
          message: data.message,
          sender: user?.email
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('chat-app')}` } }
      );

      //// Log success and reset the form
      console.log('Message sent:', res.data.messageResponse);
      setMessages((prevMessages)=>[...prevMessages, res.data.messageResponse])
      const newMessageAndChat = {
        chat: {
          chatId,
          users: [user?.email, secondUser?.email]
        },
        message: res.data.messageResponse
      }

      socket?.emit('new-message', newMessageAndChat)

      reset();
    } catch (error) {
      //// Log and handle the error
      console.error('Error sending message:', error);
    }
  };












  // we want to run this side effect in any change in any state for receiving message
  useEffect(() => {
    socket?.on("message-received", (newMessageReceived: any) => {
      //checking if the message is for this chat 

      if ( chatId !== newMessageReceived.chatId) {
        Swal.fire({
                    position: "top-end",
                    icon: "info",
                    title: `${newMessageReceived.sender.split('@')[0]} sent you a message`,
                    text:`${newMessageReceived.content}....`,
                    showConfirmButton: false,
                    timer: 2000
                  });
      } else {

        console.log('newMessageReceived');


        setMessages((prevMessages) => [...prevMessages, newMessageReceived])
      }

    })
  }, [socket])






  const typingHandler = () => {
    if (!socketConnected) return

    if (!typing) setTyping(true)
    socket.emit('typing', chatId)


    /// set it later

  }


  return (

    <>



      <div className="flex flex-col h-screen pt-2 pb-5 flex-end">
        <div className='border-b-2 pb-1 mb-2'>

          <div className="flex flex-row w-full gap-3 ps-2 justify-start items-center text-gray-700">
            <button className="text-white " title='back' onClick={() => navigate(-1)}>
              <IoMdArrowBack className="w-7 h-7 text-blue-500" />
            </button>
            <div className=''>


              <div
                style={{ backgroundImage: `url(${secondUser?.photoURL})` }}
                className="md:w-14 md:h-14 bg-cover bg-center rounded-full "
              >
                {/* <img src={user?.photoURL!} className="w-full h-full" alt="" /> */}
              </div>
            </div>
            <div className=''>
              <h3 className='text-xl font-medium'>{secondUser?.name}</h3>
              <h4 className='text-sm text-gray-500'>{secondUser?.email}</h4>
            </div>

          </div>
        </div>
        {loading ? <div className='h-full'>
          loading...
        </div> : <>


          <div className='overflow-y-scroll h-full  md:px-10 px-5 flex   '>
            <div id="chat-container" className="w-full flex flex-col pb-2">
              <div className="flex-grow"></div>
              {messages.map((message) => (
                <div key={message._id} className={`w-full mb-2 flex ${message.sender === user?.email ? 'justify-end' : 'justify-start'}`}>
                  <div title={new Date(message.timeStamp).toLocaleString()} className={`max-w-xs rounded-lg px-4 py-2 ${message.sender === user?.email ? 'bg-purple-600 text-white self-end' : 'bg-gray-300 text-black self-start'}`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>}


        <div className="border-t-2 mt-2 pt-2">
          {/* Send message form */}
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto flex gap-2 items-center justify-center">
            {/* Input field with register hook */}
            <input

              type="text"
              {...register('message')} // Register input with name 'message'
              placeholder="Enter your message"
              className="border rounded-md p-2 w-full"
            />
            {/* Submit button */}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2  rounded-md hover:bg-blue-600 transition-colors duration-300">
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Chat