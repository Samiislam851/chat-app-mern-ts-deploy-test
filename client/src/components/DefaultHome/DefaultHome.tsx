import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../../Configs/ContextProvider'

type Props = {}

const DefaultHome = (props: Props) => {
  const [name, setName] = useState<string | null>(null)
  const { user } = useContext(Context)!


  useEffect(() => {
    setName(user?.displayName!)
  }, [user])



  return (
    <div className='flex justify-center items-center min-h-[80%]'>
      <div className='mx-2 backdrop-blur border-gray-500 border-opacity-60 border rounded-xl p-5 bg-white bg-opacity-10 max-w-md'>
        <h3 className='text-gray-300 font-thin text-xl md:text-3xl text-center'>

          Greetings, {name && name} 🥳! <br />
          <sub>
          You've arrived at ChitChatz,<br /> your new hub for engaging discussions and friendly banter.
          </sub>
        </h3>

        <p className='text-xs text-gray-400 text-center pt-10'> <span className='font-bold'>Suggestion:</span> You can search for your friends on chitchatz add them and start talking</p>
      </div>


    </div>
  )
}

export default DefaultHome