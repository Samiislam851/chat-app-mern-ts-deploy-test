import axios from 'axios'
import { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { Context } from '../../Configs/ContextProvider'
import { IoMdArrowBack } from 'react-icons/io'

import Tic from '../../assets/facebook_chat_pop.mp3'

import toast from 'react-hot-toast'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { SocketContext } from '../../Configs/SocketContextProvider'


interface Props { }
interface inputObject {
  message: string,
}

const Chat = (props: Props) => {


  const ticSound = new Audio(Tic)

  const [isOnline, setIsOnline] = useState<boolean>(false)

  const [isSending, setIsSending] = useState(false)



  const { chatId } = useParams()
  const { user, logOut } = useContext(Context)!

  const { socket, messages, onlineUsers, setMessages, typingData } = useContext(SocketContext)!

  const navigate = useNavigate()

  const [secondUser, setSecondUser] = useState<{ id: string, name: string, photoURL: string, email: string } | null>(null)
  const [users, setUsers] = useState<{ id: string, name: string, photoURL: string, email: string }[] | null>(null)

  const [loading, setLoading] = useState<boolean>(false)

  const [typing, setTyping] = useState(false)


  const container = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, reset, watch } = useForm<inputObject>();





  // /////////////////////// fetching data logic //////////////

  useEffect(() => {
    setLoading(true)

    try {
      axios.get(`/messages/${chatId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('chat-app')}` } })

        .then(res => {

          setMessages(res.data.messages)
          setUsers(res.data.users)

          setLoading(false)
        })

        .catch(err => {

          setLoading(false)
          console.log(err)
          if (err.response.status === 401) {
            logOut()
          }
        })
    } catch (error) {

    } finally {

    }


  }, [])



  useEffect(() => {

    if (users) {
      const user2 = users.filter(listedUser => listedUser.email !== user?.email)
      setSecondUser(user2[0])
    }
  }, [users])


  useEffect(() => {
    if (secondUser) {
      const mail: string = secondUser?.email
      if (onlineUsers?.includes(mail)) setIsOnline(true)
      else setIsOnline(false)
    }
  }, [onlineUsers, socket])


  //////////////////////// send message function////////

  const onSubmit = async (data: inputObject) => {

    if (data.message.trim() == "") {

      toast.error('cannot send empty message')

    } else {

      try {

        setIsSending(true)
        reset()
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
        setMessages((prevMessages) => [...prevMessages, res.data.messageResponse])
        const newMessageAndChat = {
          chat: {
            chatId,
            users: [user?.email, secondUser?.email]
          },
          message: res.data.messageResponse,
          senderName: user?.displayName,
          senderPhoto: user?.photoURL
        }
        console.log('second User ==== >>> ', secondUser);
        console.log('users ==== >>> ', newMessageAndChat);

        socket?.emit('new-message', newMessageAndChat)

        const data2 = {
          user1: user?.email,
          user2: secondUser?.email
        }
        socket?.emit('typing stopped', data2)
        setAlreadyEmitted(false)
        reset();
        ticSound.play()
      } catch (err: any) {
        //// Log and handle the error
        console.error('Error sending message:', err);
        if (err.response.status === 401) {
          logOut()
        }
      } finally {

        setIsSending(false)

      }
    }
  };




  ///////////////////////////////////// typing functionality


  const message = watch('message');


  const [alreadyEmitted, setAlreadyEmitted] = useState(false)

  useEffect(() => {
    const data = {
      user1: user?.email,
      user2: secondUser?.email
    }

    if (message !== '') {

      if (!alreadyEmitted) {
        setAlreadyEmitted(true)
        socket?.emit('typing emit', data)
      }

    } else {
      socket?.emit('typing stopped', data)
      setAlreadyEmitted(false)
    }
  }, [message])



  if (typingData.typing) {
    console.log(typingData.user, 'is typing', typingData.typing);

  }











  const [initialLoad, setInitialLoad] = useState(true)


  const Scroll = () => {
    if (container.current) {
      const { offsetHeight, scrollHeight, scrollTop } = container.current as HTMLDivElement

      // console.log('offsetHeight :', offsetHeight, 'scrollHeight :', scrollHeight, 'scrollTop : ', scrollTop);
      // search mozilla developers if forgotten what these are
      container.current?.scrollTo({ left: 0, top: scrollHeight, behavior: "smooth" })


      // if (initialLoad) {
      //   container.current?.scrollTo({ left: 0, top: scrollHeight })
      // }
      // else if ((scrollHeight <= scrollTop + offsetHeight + 700) || initialLoad) {
      //   container.current?.scrollTo({ left: 0, top: scrollHeight, behavior: "smooth" })
      // }
    }

    if (messages?.length > 0) {
      setInitialLoad(false)
    }
  }

  useEffect(() => {
    Scroll()
  }, [messages, typingData.typing])














  return (

    <>



      <div className="flex flex-col h-screen  flex-end backdrop-blur-sm">



        <div className='border-b border-gray-400 border-opacity-50    mb-2'>

          <div className="py-2 flex flex-row w-full gap-3 ps-2 justify-start items-center text-gray-300 backdrop-blur-md bg-gray-300 bg-opacity-10 ">
            <button className="text-white " title='back' onClick={() => {
              setInitialLoad(true); navigate(-1);
              setMessages([])
            }}>
              <IoMdArrowBack className="w-7 h-7 text-blue-300" />
            </button>
            <div className=''>


              <div
                style={{ backgroundImage: `url(${secondUser?.photoURL})` }}
                className="w-14 h-14 bg-cover bg-center rounded-full "
              >

              </div>
            </div>
            <div className=''>

              <div className='flex items-center gap-2 justify-start'>
                <h3 className='text-xl font-medium text-gray-300'>{secondUser?.name}  </h3>
                <div title={isOnline ? ' user is Online ' : ''} className={`${isOnline ? 'p-1 rounded-full mt-1 bg-green-500 ' : ''} `}></div>
              </div>
              <h4 className='text-sm text-gray-300'>{secondUser?.email}</h4>
            </div>

          </div>
        </div>
        {loading ? <div className='h-full flex items-center justify-center'>
          <AiOutlineLoading3Quarters className='text-6xl animate-spin text-gray-300' />
        </div> : <>


          <div ref={container} className='overflow-y-scroll h-full  md:px-10 px-5 flex'>
            <div id='chat-container' className='w-full flex flex-col pb-2'>
              <div className='flex-grow'></div>
              {messages.map(message => (
                <div
                  key={message._id}
                  className={`w-full mb-2 flex ${message.sender === user?.email ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    title={new Date(message.timeStamp).toLocaleString()}
                    className={`max-w-xs text-lg rounded-lg px-4 py-2 ${message.sender === user?.email ? 'bg-[#A155B9] text-white self-end' : 'bg-gray-200 text-gray-600 self-start'
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {(typingData.user === secondUser?.email && typingData.typing) ? <>

                <div

                  className={`w-full mb-2 flex  'justify-end' : 'justify-start`}
                >
                  <div className='bg-gray-300  h-10 w-fit rounded-full flex items-center'>
                    <div className='text-gray-600 animate-pulse px-3'>typing...</div>
                  </div> </div>

              </> : <></>}






            </div>
          </div>
        </>}


        <div className="border-t border-gray-400 border-opacity-50 backdrop-blur-md mt-1 px-2 py-4 bg-gray-500 bg-opacity-20">
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
            <button type="submit" className="bg-blue-500 text-white px-4 py-2  rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2">
              {!isSending ? <>  <span>Send</span></> : <span className='animate-pulse'>Sending</span>}

              {isSending ? <>
                <AiOutlineLoading3Quarters className={`text-sm animate-spin text-gray-300`} />
              </> : <></>}


            </button>
          </form>
        </div>
      </div>

    </>
  )
}

export default Chat