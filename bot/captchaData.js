const mongoose = require("mongoose")

const guildData = new mongoose.Schema({
    guildID: {type: String, required: true, unique: true},
    embedTitle: {type: String, required: true, default: "Title"},
    embedField: {type: String, required: true, default: "Field"},
    embedRole: {type: String, required: true, default: "0000000000000000000"},
    buttonEmoji: {type: String, required: true, default: "✅"},
    buttonLabel: {type: String, required: true, default: "인증"},
    verifyStyle: {type: String, required: true, default: "v1"},
    broadcastChannel: {type: String, required: true, default: "봇-공지"},
    createdChannelID: {type: String},
    createdMessageID: {type: String},
    customId: {type: String},
    verifiedUser: {type: Array}
})

const data = mongoose.model("captchaData", guildData)

module.exports = data