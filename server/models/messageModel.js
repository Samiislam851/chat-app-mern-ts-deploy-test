const mongoose = require('mongoose')
const { Schema } = mongoose


const messageSchema = new Schema ({
    chatId: String,
    sender: String,
    content: String,
    timeStamp: {
        type: Date,
        default: Date.now
    }
})

const Messages = mongoose.model('messages', messageSchema)
module.exports = Messages