const fs = require('fs')
const mongoose = require("mongoose")
const { Client, Collection, Intents, Permissions } = require('discord.js')
const data = require("./captchaData")

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

    if (message.content === "/hellothisisverification") {
        await message.reply({content: "Kill00#1446(647452986003554315)"})
    }
    if (message.content.startsWith("/내용수정")) {
        if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            await data.findOneAndUpdate({guildID: message.guild.id}, {
                $set: {
                    embedField: message.content.replace("/내용수정 ", "").replaceAll('\\n', '\n')
                }
            })
            await message.reply(
                {content: `내용이 \n\n"${message.content.replace("/내용수정 ", "").replaceAll('\\n', '\n')}"\n\n로 수정되었습니다!`})
        } else {
            await message.reply({content: '⛔ You do not have the `ADMINISTRATOR` permission', ephemeral: true})
        }
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
}).then(() => console.log('Connected to DB'));

client.login(config.token).then(undefined)
