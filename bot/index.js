const mongoose = require("mongoose")
const { Client, Intents } = require('discord.js')

// Json Files
const config = require("../data/config.json")

const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS] })

// Dokdo (Debug)
const Dokdo = require("dokdo")
const DokdoHandler = new Dokdo(client,
    { aliases: ['dokdo', 'dok', 'd', 'run'],
        prefix: config.prefix,
        noPerm: (message) => message.reply('🤔 Who are you?') })

// Legacy
client.on('messageCreate', async message => {
    DokdoHandler.run(message)
})

mongoose.connect(`${require("../data/mongo.json").DB}`)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Connected to MongoDB");
});

client.login(config.token).then(undefined)
