const mongoose = require('mongoose')
const { Schema } = mongoose


const chatSchema = new Schema({
    users: [String],
    chatName: String,
    lastMessage : Object
})

const Chats = mongoose.model('chats', chatSchema)

module.exports = Chats