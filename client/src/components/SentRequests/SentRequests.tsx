
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Context } from '../../Configs/ContextProvider';
import { MongoUser } from '../../types/types';
import RequestedPersonCard from '../RequestedPersonCard/RequestedPersonCard';



type Props = {}
type inputObject = {
    input: string
}



const SentRequests = (props: Props) => {




    const { user, logOut } = useContext(Context)!
    const [loading, setLoading] = useState<boolean>(false)

    const [requestedPersons, setRequestedPersons] = useState<MongoUser[]>([])




    // console.log(searchedUsers);
    const [dbUser, setDbUser] = useState<MongoUser | null>(null)
    useEffect(() => {
        setLoading(true)
        axios.get(`http://localhost:3000/get-sent-requests?email=${user?.email}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('chat-app')}`
            }
        })
            .then(res => {


                setRequestedPersons(res.data.users)
                setLoading(false)

            })
            .catch(err => {

                setLoading(false)
                console.log(err)
            }
            )

    }, [])


    return (
        <div className='py-20'>



            {loading ?

                <div className='w-full flex justify-center items-center py-20'>
                    <AiOutlineLoading3Quarters className='animate-spin text-6xl text-gray-600' />

                </div>
                :



                <div className='max-w-md  mx-auto'>

                    <h3 className='text-sm text-[#81689D] pb-1'>Sent Requests: </h3>
                    <div className='border-t pt-0'>

                        {!requestedPersons[0] && <div className='text-xl text-center py-10 text-gray-500'>
                            No Sent requests
                        </div>}
                        <ul className='list-none '>
                            {


                                /////////////////// create an array of requested users then show them here

                                requestedPersons?.map((requestedPerson: MongoUser, i: number) => <RequestedPersonCard key={i} dbUser={dbUser} setDbUser={setDbUser} requestedPersons={requestedPersons} setRequestedPersons={setRequestedPersons} requestedPerson={requestedPerson} />)
                            }

                        </ul>
                    </div>
                </div>

            }

        </div >
    )
}

export default SentRequests