import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { UserCredential } from "firebase/auth";
import { MongoUser, User } from '../types/types';
import app from '../utils/firebase';
import io from 'socket.io-client'
//////////////// interfaces and types ////////////////////////
type Props = {
    children: ReactNode
}

export interface valueType {
    first: boolean,
    setFirst: React.Dispatch<React.SetStateAction<boolean>>,
    googleLogin: () => Promise<UserCredential>,
    user: User | null,
    logOut: () => void,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    emailSignIn: (email: string, password: string) => Promise<UserCredential>,
    emailRegister: (email: string, password: string) => Promise<UserCredential>,
    addUserDetails: (name: string, photoURL: string) => Promise<void>,
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    dbUser: MongoUser | null,
    setDbUser: React.Dispatch<React.SetStateAction<MongoUser | null>>,
    notification : any,
    setNotification: React.Dispatch<any>,
    socket : any
}






//////////////////// context declaration ///////////////

export const Context = createContext<valueType | null>(null)



export default function ContextProvider({ children }: Props) {

    const [first, setFirst] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null)
    const [dbUser, setDbUser] = useState<MongoUser | null>(null)


    ////////////////////  firebase features initialization ///////////////
    const googleProvider = new GoogleAuthProvider();
    const auth = getAuth(app);

    const googleLogin = (): Promise<UserCredential> => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }




    useEffect(() => {
        const unsubscribe = () => {
            onAuthStateChanged(auth, (loggedUser: User | null) => {
                setUser(loggedUser)
                setLoading(false)
            })
        }
        // const currentUser = auth.currentUser;
        // if (currentUser) {
        //     setUser(currentUser);
        // }

        return () => {
            unsubscribe()
        }
    }, [])



    const emailRegister = (email: string, password: string) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }


    const addUserDetails = (name: string, photoURL: string) => {
        return updateProfile(auth.currentUser!, {
            displayName: name, photoURL: photoURL
        })
    }


    const emailSignIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)

    }

    ////////////////////// Sign Out ////////////////////////////
    const logOut = () => {
        setLoading(true)
        signOut(auth).then(() => {
            setUser(null);
            setLoading(false)
        }).catch((error) => {
            console.log(error);

        });
    }


const [notification, setNotification] = useState<any>([])



useEffect(() => {
    console.log(notification);
}, [notification])

//////////////////////////  socket connection /////////////
const [socket, setSocket] = useState<any>(null)

// useEffect(() => {

// if(user){
//     const newSocket = io("/");

//     newSocket.on('connect', () => {
    
//       setSocket(newSocket)


//       console.log('Connected to socket server');
//     }
//     )
//     newSocket.emit('setup', user);

// }
    
//     return () => {
//       // newSocket.disconnect();
//     };
//   }, [user]);








//   useEffect(() => {
//     socket?.on('message-received', (newMessageReceived: any) => {
//       if (chatId !== newMessageReceived.chatId) {
//         Swal.fire({
//           position: "top-end",
//           icon: "info",
//           title: `${newMessageReceived.sender.split('@')[0]} sent you a message`,
//           text:`${newMessageReceived.content}....`,
//           showConfirmButton: false,
//           timer: 2000
//         });
//       } else {
//         setMessages(prevMessages => [...prevMessages, newMessageReceived]);
//       }
//     });
//   }, [socket]);











/////////////////////////////////////////////////////////////
    const value: valueType = {
        first, setFirst, googleLogin,  logOut,
        loading, setLoading, emailRegister, emailSignIn, addUserDetails,user, setUser, dbUser, setDbUser,setNotification,notification,  socket }

    return (
        <Context.Provider value={value}>
            <Toaster position='top-center' reverseOrder={false} />
            {children}
        </Context.Provider >
    )
}