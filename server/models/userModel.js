const mongoose = require('mongoose')
const { Schema } = mongoose;



const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
    },
    photoURL: String,
    friends: [String],
    incomingRequests: [String],
    pendingRequests: [String],
    chats: [String]

})

const User = mongoose.model('users', userSchema)
module.exports = User