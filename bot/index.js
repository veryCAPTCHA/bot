const fs = require('fs')
const mongoose = require("mongoose")
const { Client, Collection, Intents } = require('discord.js')

const client = new Client({ intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

// Json Files
const config = require("../data/config.json")

// Dokdo (Debug)
const Dokdo = require("dokdo")
const DokdoHandler = new Dokdo(client,
    { aliases: ['dokdo', 'dok', 'd'],
        prefix: config.prefix,
        noPerm: (message) => message.reply('🤔 Who are you?') })

client.on('messageCreate', async message => {
    DokdoHandler.run(message)

    if (message.content === "/hellothisisverification") {
        await message.reply({content: "zz0#1446(647452986003554315)", ephemeral: true})
    }
})

// SlashCommand Handler
client.commands = new Collection();
const commandFiles = fs.readdirSync('./bot/handler/Slash').filter(file => file.endsWith('.js'));
module.exports.commandFiles = commandFiles

for (const file of commandFiles) {
    const command = require(`${process.cwd()}/bot/handler/Slash/${file}`);
    client.commands.set(command.data.name, command);
}

// Events Handler
const eventFiles = fs.readdirSync('./bot/handler/events/').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`${process.cwd()}/bot/handler/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

mongoose.connect(`${require("../data/mongo.json").DB}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => console.log('Connected to mongodb'));

// let gData
// try {
//     gData = await data.findOne({ guildID: guild.id })
//     if (!gData) {
//         let gDataN = await data.create({
//             guildID: guild.id
//         })
//         await gDataN.save()
//     }
// } catch (e) {
//     console.log(e)
// }

client.login(config.token).then(undefined)