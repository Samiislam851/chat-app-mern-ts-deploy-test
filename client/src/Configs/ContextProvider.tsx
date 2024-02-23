import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { UserCredential } from "firebase/auth";
import { MongoUser, User } from '../types/types';
import app from '../utils/firebase';
import io, { Socket } from 'socket.io-client'
import axios from 'axios';
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
    notification: any,
    setNotification: React.Dispatch<any>,
    requests: object[] | null,
    setRequests: React.Dispatch<React.SetStateAction<object[] | null>>,
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    loggedIn: boolean
}






//////////////////// context declaration ///////////////

export const Context = createContext<valueType | null>(null)



export default function ContextProvider({ children }: Props) {

    const [first, setFirst] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(true)
    const [user, setUser] = useState<User | null>(null)
    const [dbUser, setDbUser] = useState<MongoUser | null>(null)
    const [loggedIn, setLoggedIn] = useState<boolean>(false)

    ////////////////////  firebase features initialization ///////////////
    const googleProvider = new GoogleAuthProvider();
    const auth = getAuth(app);

    const googleLogin = (): Promise<UserCredential> => {
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }








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





    ///// friend requests ///

    const [requests, setRequests] = useState<object[] | null>([])

    useEffect(() => {

        if (user && loggedIn) {

            console.log('user email', user.email);


            axios.get(`/get-friend-requests?email=${user?.email}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('chat-app')}`
                }
            })
                .then(res => {
                    setRequests(res.data.users)
                })
                .catch(err => {


                    console.log(err)
                    if (err.response.status === 401) {
                        logOut()
                    }
                }
                )
        }


    }, [user])


    useEffect(() => {
     
        console.log('outside auth state changed unsubscribe');
        const unsubscribe = onAuthStateChanged(auth, (loggedUser: User | null) => {
            setUser(loggedUser)
            console.log('on auth state changed func user:', loggedUser);
            setLoading(false)
          });
          
        console.log('user ::: after onAuthStateChanged', user);
        
      return () => {
        console.log('unsubscribing');
        unsubscribe()
      }
    }, [])



    







    // for production  error  using local storage for saving the user credentials

    // useEffect(() => {
    //     const storedUserCred = localStorage.getItem('userCred');



    //     if (storedUserCred !== null) {
    //         const userCred = JSON.parse(storedUserCred);
    //         const { email, pass } = userCred!
    //         emailSignIn(email, pass)

    //     } else {
    //         // Handle the case where 'userCred' is not found in localStorage
    //     }

    //     return () => {
        
    //     }
    // }, [])




    /////////////////////////////////////////////////////////////
    const value: valueType = {
        first, setFirst, googleLogin, logOut,
        loading, setLoading, emailRegister, emailSignIn, addUserDetails, user, setUser, dbUser, setDbUser, setNotification, notification, requests, setRequests, setLoggedIn, loggedIn
    }

    return (
        <Context.Provider value={value}>
            <Toaster position='top-center' reverseOrder={false} />
            {children}
        </Context.Provider >
    )
}