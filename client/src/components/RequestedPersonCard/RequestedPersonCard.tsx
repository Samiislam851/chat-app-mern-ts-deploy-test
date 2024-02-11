
import React, { useContext, useState } from 'react'
import { MongoUser } from '../../types/types';
import axios from 'axios';
import { Context } from '../../Configs/ContextProvider';
import toast from 'react-hot-toast';
import { VscLoading } from 'react-icons/vsc';

type Props = {
    requestedPerson: MongoUser,
    requestedPersons: MongoUser[],
    setRequestedPersons: React.Dispatch<React.SetStateAction<MongoUser[]>>,
    dbUser: MongoUser | null,
    setDbUser: React.Dispatch<React.SetStateAction<MongoUser | null>>
}

const RequestedPersonCard = ({ requestedPerson, dbUser, setDbUser, requestedPersons, setRequestedPersons }: Props) => {
    console.log('.,...dADVASDVA.S D.......', dbUser);

    const { user } = useContext(Context)!
    // Update the destructure to use requestedPerson
    const { photoURL, name, _id, email } = requestedPerson;
    const [loading, setLoading] = useState(false)




    const cancelRequest = async () => {

        try {
            setLoading(true)
            const res = await axios.post(`/cancel-request-from-requester?user1email=${user?.email}&&user2email=${email}`, { user }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('chat-app')}`
                }
            })

            if (res.status == 200) {


                const otherRequestedPersons = requestedPersons?.filter((reqPerson) => reqPerson.email !== email)
                setRequestedPersons(otherRequestedPersons)

            }

            toast.success(res.data.message);

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false)
        }



    }












    return (
        <div className='flex items-center justify-between border-t py-2'>
            <div className="basis-1/2 flex gap-2">
                <div style={{ backgroundImage: `url('${photoURL}')` }} className='w-[50px] overflow-hidden rounded-full h-[50px] hover:scale-[5] md:hover:scale-[5] md:hover:ms-[-110px] md:hover:me-[200px]  hover:translate-x-24 transition-all ease-in-out duration-300 border  border-gray-300 flex justify-center items-center bg-cover bg-center'>
                    {/* <img src={image ? image : ''} className='w-full ' alt={name ? name : ''} /> */}

                </div>
                <div className="">
                    <h3 className='text-gray-500 text-lg'>{name}</h3>
                    <h3 className='text-gray-500 text-xs'>{email}</h3>
                </div>
            </div>

            <div className="basis-1/2">

                <button onClick={cancelRequest} className='bg-[#d72f2f] text-white px-3 py-1 rounded float-end hover:scale-105 transition-all ease-in-out duration-300  hover:shadow-lg'>{loading ? <><VscLoading className='inline text-lg animate-spin' /> </> : <>Cancel request</>}  </button>




            </div>

        </div>
    )
}

export default RequestedPersonCard
