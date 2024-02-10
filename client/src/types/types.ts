export interface User {
    uid: string; 
    displayName: string | null; 
    email: string | null; 
    photoURL: string | null;
}
export interface MongoUser{
    _id?: string;
    name: string;
    email:string,
    photoURL : string;
    friends?: string[],
    incomingRequests?: string[],
    pendingRequests?:string[],
    chats?: string[]
}
