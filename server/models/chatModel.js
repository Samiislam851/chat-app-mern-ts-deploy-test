const mongoose = require('mongoose')
const { Schema } = mongoose


const chatSchema = new Schema({
    users: [String],
    chatName: String
})

const Chats = mongoose.model('chats', chatSchema)

module.exports = Chats