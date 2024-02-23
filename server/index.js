const express = require('express')

const cors = require('cors');
require('dotenv').config();

const app = express()
const db = require('./config/db');

const User = require('./models/userModel');

const generateToken = require('./config/generateToken');
const verifyJWT = require('./middleware/VerifyJWT');
const Chats = require('./models/chatModel');
const Messages = require('./models/messageModel');
const http = require('http');
const path = require('path');

const expressServer = http.createServer(app)





/// Basic middlewares
app.use(cors())
app.use(express.json())






const server = app.listen(process.env.PORT || 3000, () => {
    console.log('example listening to port', 3000);
})
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:5173'
    }
})











///////////////// socket //////////////
const connectedUsers = {};

io.on('connection', (socket) => {



    connectedUsers[socket.handshake.query.user] = socket.id



    console.log('socket connected', socket.handshake.query.user, '==', socket.id, '\n users', connectedUsers);
    let onlineUsers = Object.keys(connectedUsers)

    console.log('Before emit line user : ', onlineUsers);
    io.emit('getOnlineUsers', onlineUsers)
    console.log('After emit line user : ', onlineUsers);

    socket.on('disconnect', () => {
        delete connectedUsers[socket.handshake.query.user]

        let onlineUsers = Object.keys(connectedUsers)
        io.emit('getOnlineUsers', onlineUsers)

        console.log('disconnected from socket', socket.handshake.query.user, '==', socket.id, 'connected', connectedUsers);
    })


    socket.on('new-message', (newMessageAndChat) => {
        let chat = newMessageAndChat.chat;

        console.log('from new message', chat.users);

        if (!chat.users) return console.log('no user in this chat');


        const chatUsers = Object.values(chat.users)
        console.log('chat users', chatUsers);

        chatUsers.forEach((user) => {
            if (user == newMessageAndChat.message.sender) return
            console.log('user.email', user);
            if (connectedUsers[user]) {
                console.log('connectedUsers  user', connectedUsers[user], '==', user, "\n message", newMessageAndChat.message);
                io.to(connectedUsers[user]).emit("message-received", newMessageAndChat)
            }
        })
    })



    socket.on('typing emit', (data) => {
        const { user1, user2 } = data
        console.log('typing started');
        const resData = { user: user1, typing: true }
        io.to(connectedUsers[user2]).emit('typing', resData)
    })
    socket.on('typing stopped', (data) => {
        const { user1, user2 } = data
        const resData = { user: user1, typing: false }
        console.log('typing stopped');
        io.to(connectedUsers[user2]).emit('typing stopped', resData)
    })


    socket.on('request accepted', (data) => {
        const { user1, user1name, user2Email } = data
        const user = { name: user1name, email: user1 }
        io.to(connectedUsers[user2Email]).emit('request accepted res', user)
    })



    socket.on('send request', (data) => {
        const { user1name, user1Email, user2Email } = data
        const user = { name: user1name, email: user1Email }

        console.log('from socket user that accepted => ', user, user2Email);
        io.to(connectedUsers[user2Email]).emit('send request res', user)
        console.log('sent >>>>>>>>>>>>>>>>> from socket user that accepted => ', user, user2Email);
    })


    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))
})






/// register user///

app.post('/saveUser', async (req, res) => {
    // console.log(req.body)

    const user = new User(req.body)


    try {

        const userEmail = user.email

        const response = await User.findOne({ email: userEmail })

        if (!response) {

            try {
                const response = await user.save()
                const token = generateToken(response);

                // console.log(token);

                /// return a token from here also
                res.status(200).json({ success: true, message: 'saved', user: response, token })
            } catch (error) {
                res.status(500).json({ success: false, message: 'Internal Server Error', error })
            }
        } else {
            res.status(400).json({ success: false, message: 'Bad request | User Already Exists', response })
        }


    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error })
    }
})

/////////////////////////////////////////// login give token to user
app.post('/login', async (req, res) => {

    const user = new User(req.body)
    // console.log('the user ', user);

    try {

        const userEmail = user.email

        const response = await User.findOne({ email: userEmail })
        const token = generateToken(response)
        // console.log('token', token);
        if (!response) {

            res.status(400).json({ success: false, message: 'Not Found', response })

        } else {
            res.status(200).json({ success: true, message: 'user Found', user: response, token })
        }


    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error })
    }

})

//////////////////////////////////////////////// Search user ///////////////////////////////////////////////////////

app.post('/search-user', verifyJWT, async (req, res) => {

    const decoded = req.decoded

    const requester = req.body.user.email


    // console.log('requester', requester);

    const { inputValue } = req.body;

    try {

        const regexPattern = new RegExp("\\b" + inputValue + "\\w{0,}\\b", "i");
        const users = await User.find({
            $or: [
                { name: regexPattern }
                ,
                { email: regexPattern }
            ]
        })



        const filteredUsers = users.filter(user => user.email !== requester)
        res.status(200).json({ users: filteredUsers, success: true })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'server error' })
    }
})


//////////////////////////////////////////// Send Request ////////////////////////////////////////////////

app.post('/send-request', verifyJWT, async (req, res) => {
    const email1 = req.query.user1email
    const email2 = req.query.user2email
    // console.log('verified', email1, email2, req.query);


    /////////////// sending request from id1 to id2 


    try {
        const user1 = await User.findOneAndUpdate({ email: email1 }, { $addToSet: { pendingRequests: email2 } }, { new: true })
        const user2 = await User.findOneAndUpdate({ email: email2 }, { $addToSet: { incomingRequests: email1 } }, { new: true })
        // console.log('user2 ::::::::::', user2);
        // console.log('user1 ::::::::::', user1);




        if (user1 && user2) {
            res.status(200).json({ message: 'Request Sent', user: user1 })
        }


    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
})



////////// Cancel Request



app.post('/cancel-request', verifyJWT, async (req, res) => {
    const email1 = req.query.user1email;
    const email2 = req.query.user2email;
    // console.log('verified', email1, email2, req.query);

    try {
        const user1 = await User.findOneAndUpdate(
            { email: email1 },
            { $pull: { incomingRequests: email2 } }, // Remove email2 from incomingRequests
            { new: true }
        );

        const user2 = await User.findOneAndUpdate(
            { email: email2 },
            { $pull: { pendingRequests: email1 } }, // Remove email1 from pendingRequests
            { new: true }
        );

        // console.log('user2 ::::::::::', user2);
        // console.log('user1 ::::::::::', user1);

        if (user1 && user2) {
            res.status(200).json({ message: 'Request canceled successfully.', user: user1 });
        } else {
            res.status(404).json({ message: 'Users not found or request already canceled.' });
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("internal server error")
    }
})










///////// Canceling request from requester


app.post('/cancel-request-from-requester', verifyJWT, async (req, res) => {
    const email1 = req.query.user1email;
    const email2 = req.query.user2email;
    // console.log('verified', email1, email2, req.query);

    try {
        const user1 = await User.findOneAndUpdate(
            { email: email1 },
            { $pull: { pendingRequests: email2 } }, // Remove email2 from pendingRequests
            { new: true }
        );

        const user2 = await User.findOneAndUpdate(
            { email: email2 },
            { $pull: { incomingRequests: email1 } }, // Remove email1 from incomingRequests
            { new: true }
        );

        // console.log('user2 ::::::::::', user2);
        // console.log('user1 ::::::::::', user1);

        if (user1 && user2) {
            res.status(200).json({ message: 'Request canceled successfully.', user: user1 });
        } else {
            res.status(404).json({ message: 'Users not found or request already canceled.' });
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("internal server error")
    }
})






//////////////////////// get an User ////////////////

app.get('/get-single-user', verifyJWT, async (req, res) => {

    const decoded = req.decoded

    const requester = req.query.email



    // console.log('requester >>> ', requester);

    const { inputValue } = req.body;

    try {
        const user = await User.findOne({
            email: requester
        })



        res.status(200).json({ user, success: true })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'server error' })
    }
})


///////////// get friend request list

app.get('/get-friend-requests', verifyJWT, async (req, res) => {

    const decoded = req.decoded

    const requester = req.query.email


    try {
        const user = await User.findOne({
            email: requester
        })


        const incomingEmails = user.incomingRequests;

        // Find users whose email addresses are in the incomingEmails array
        const users = await User.find({ email: { $in: incomingEmails } });

        res.status(200).json({ users, success: true })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'server error' })
    }
})


//////// get friends



app.get('/get-friends', verifyJWT, async (req, res) => {

    const decoded = req.decoded

    const requester = req.query.email


    try {
        const user = await User.findOne({
            email: requester
        })

        const friends = user.friends;

        // Find users whose email addresses are in the friends array
        const users = await User.find({ email: { $in: friends } })

        res.status(200).json({ users, success: true })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'server error' })
    }
})


//////// get-Chats
app.get('/get-chats', verifyJWT, async (req, res) => {



    const userEmail = req.query.email

    let usersTemp = []
    try {
        const user = await User.findOne({
            email: userEmail
        })

        const chatIds = user.chats;

        // Find users whose email addresses are in the friends array
        const chats = await Chats.find({ _id: { $in: chatIds } })

        chats.forEach(chat => usersTemp.push(...chat.users))

        // console.log(usersTemp);

        const userEmails = usersTemp.filter(user => user !== userEmail)

        const chatUsers = await User.find({ email: { $in: userEmails } }).select('name email photoURL chats')
        // console.log(chatUsers);

        const chatsFinal = chats.map(chat => {

            for (let i = 0; i < chatUsers.length; i++) {
                if (chatUsers[i].chats.includes(chat._id)) {
                    const obj = {
                        userId: chatUsers[i]._id,
                        name: chatUsers[i].name,
                        email: chatUsers[i].email,
                        photoURL: chatUsers[i].photoURL,
                        chat
                    }
                    return obj
                }
            }
        })

        res.status(200).json({ chatsFinal, success: true })
        return

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'server error' })
        return
    }
})

//////// get-sent-requests
app.get('/get-sent-requests', verifyJWT, async (req, res) => {

    const decoded = req.decoded

    const requester = req.query.email


    try {
        const user = await User.findOne({
            email: requester
        })

        const pendingRequests = user.pendingRequests;

        // Find users whose email addresses are in the friends array
        const users = await User.find({ email: { $in: pendingRequests } })

        res.status(200).json({ users, success: true })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'server error' })
    }
})




///// accept request



app.post('/accept-request', verifyJWT, async (req, res) => {
    const email1 = req.query.user1email
    const email2 = req.query.user2email
    // console.log('verified', email1, email2);


    try {
        const user1 = await User.findOneAndUpdate({ email: email1 },
            {
                $addToSet: { friends: email2 },
                $pull: {
                    incomingRequests: email2,
                    pendingRequests: email2  // remove email from both because both user might have sent friend request to each other
                    // edit later from front-end so that when user searches for adding someone and if he/she's already sent req then just accept it  
                }

            },
            { new: true })




        const user2 = await User.findOneAndUpdate({ email: email2 },
            {
                $addToSet: { friends: email1 },
                $pull: {
                    pendingRequests: email1,
                    incomingRequests: email1, // the reason is described above


                }
            },
            { new: true })

        // console.log('user2 ::::::::::', user2);
        // console.log('user1 ::::::::::', user1);




        if (user1 && user2) {
            res.status(200).json({ message: `Added ${user2.name} as a friend`, user: user1 })
        }


    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
})


/////////////////// Chat ///////////////////

app.get('/chat/:ids', verifyJWT, async (req, res) => {
    const usersString = req.params.ids
    const userEmails = usersString.split('--')

    // console.log('user Emails', userEmails, 'the string', usersString);

    try {

        let chat = await Chats.findOne({ users: { $size: userEmails.length, $all: userEmails } })

        if (!chat) {


            console.log('chat is null creating new chat');
            const newChat = new Chats({
                users: userEmails,
                chatName: "",
                lastMessage: {
                    sender: usersString.split('--')[0],
                    content: 'no conversation yet',
                    timeStamp: new Date()
                }
            })

            chat = await newChat.save()
            const chatId = chat._id

            // console.log('savedChat::::::::', chat);

            const response = await User.updateMany(
                { email: { $in: userEmails } },
                { $push: { chats: chatId } }
            )
            // console.log('response', response);



        }
        // console.log('chat:::', chat);


        const chatId = chat._id

        res.status(200).json({ success: true, chatId, chat })

    } catch (error) {

    }
})



/////////////////////////////////////// send Message ///////////////////////////////////

app.post('/send-message/:chatId', verifyJWT, async (req, res) => {
    const chatId = req.params.chatId;
    const messageContent = req.body.message;
    const sender = req.body.sender;

    // console.log('ChatId', chatId, 'sender', sender);
    try {
        // Check if a chat exists for the given users
        let chat = await Chats.findOneAndUpdate({ _id: chatId }, {
            lastMessage: {
                sender: sender,
                content: messageContent,
                timeStamp: new Date()
            }
        });

        // If chat doesn't exist, create a new one
        if (!chat) {
            console.log('no chat with this id');
            res.status(400).json({ message: 'bad request | chat is not available' })
            return
        }

        // Create a new message
        const newMessage = new Messages({
            chatId: chat._id,
            sender: sender,
            content: messageContent
        });

        // Save the new message
        const messageResponse = await newMessage.save();
        // console.log('messageResponse', messageResponse);

        // Send response 
        res.send({ message: 'Message saved', messageResponse });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});




/////////////// get-messages /////////////

app.get('/messages/:chatId', verifyJWT, async (req, res) => {
    const chatId = req.params.chatId;
    try {
        const chat = await Chats.findOne({ _id: chatId })
        const userEmails = chat.users

        const users = await User.find({ email: { $in: userEmails } }, "email name photoURL")


        const messages = await Messages.find({ chatId: chatId });

        res.status(200).json({ messages, users });
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//------------------------  Deployment ----------------------
const __dirname2 = path.resolve()

if (true) {
    // console.log( path.join(__dirname2, "/client/dist"));
    app.use(express.static(path.join(__dirname2, "/client/dist")))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname2, "client", "dist", "index.html"))
    })
} else {
    app.get('/', (req, res) => {

        console.log(process.env.NODE_ENV);
        res.send("API is running successfully")
    })
}




// ------------------------- Deployment -----------------------


