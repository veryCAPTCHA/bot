const fs = require('fs')
const mongoose = require("mongoose")
const { Client, Collection, Intents, Permissions, MessageEmbed } = require('discord.js')
const data = require("./captchaData")

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
    if (message.content.startsWith("/내용수정")) {
        if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            await data.findOneAndUpdate({guildID: message.guild.id}, {
                $set: {
                    embedField: message.content.replace("/내용수정 ", "").replaceAll('\\n', '\n')
                }
            })
            await message.reply(
                {content: `내용이 \n\n"${message.content.replace("/내용수정 ", "").replaceAll('\\\\n', '\\n')}"\n\n로 수정되었습니다!`})
        } else {
            await message.reply({content: '⛔ You do not have the `ADMINISTRATOR` permission', ephemeral: true})
        }
    }

    let gData
    try {
        gData = await data.findOne({ guildID: message.guild.id })
        if (!gData) {
            let gDataN = await data.create({
                guildID: message.guild.id
            })
            await gDataN.save()
        }
    } catch (e) {
        console.log(e)
    }

    if (message.content.startsWith("$봇공지")) {
        let logs = []
        if (message.author.id === config.owner) {
            let contents = message.content
                .replace('$봇공지 ', '')
                .replace('everyone=True', '')
                .replaceAll("\\n", "\n")
            await message.delete()
            client.guilds.cache.each(async guild => {
                let channelName = gData.broadcastChannel
                let everyoneRole = guild.roles.cache.find(r => r.name === '@everyone');
                let getChannel = guild.channels.cache.find(c => c.name === channelName)

                    logs.push(`[Log] '서버 : ${guild.name}' 이(가) 수신되었습니다. 🟢`)
                    try {
                        logs.push(`[Log] '${guild.name}' 로 공지를 보낼 채널을 찾고 있습니다. 💬`)
                        if (!getChannel) {
                            logs.push(`[Log] '${guild.name}' 로 공지를 보낼 채널을 찾고 못했습니다. 🟠`)
                            guild.channels.create(channelName, {
                                reason: '공지 채널이 없어 자동으로 생성되었습니다.',
                                permissionOverwrites: [
                                    {
                                        id: everyoneRole.id,
                                        deny: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
                                    }
                                ]
                            }).then(async r => {
                                await r.send({content: "봇공지 채널이 없어 자동으로 생성되었습니다."})
                            })
                            logs.push(`[Log] '${guild.name}' 서버에서 '${channelName}' 채널을 생성하였습니다. ✔`)
                        }
                        logs.push(`[Log] '${guild.name}' 서버로 공지를 보낼 채널 정보를 수신받았습니다. 🟢`)

                        let avatarURL
                        if (message.author.avatarURL() !== null) {
                            avatarURL = message.author.avatarURL()
                        } else {
                            avatarURL = message.author.displayAvatarURL()
                        }

                        const embed = new MessageEmbed()
                        embed.setColor("0x00ff00")
                            .setTitle("봇 공지사항")
                            .addField("내용",
                            `${contents}
                            
                            -----
                            서포트 서버 : [바로가기](https://discord.gg/cVu6rmc)
                            봇 초대하기 : [바로가기](https://discord.com/api/oauth2/authorize?client_id=881476730001457172&permissions=141130320976&scope=bot%20applications.commands)
                            -----
                            해당 채널에서 봇 공지를 받고 싶지 않으시다면 '/채널설정 #채널' (으)로 설정해 주세요`)
                            .setTimestamp()
                            .setFooter(`작성자 : ${message.author.tag} | 개발자 : ${client.users.cache.find(user => user.id === config.owner).tag}`, avatarURL)

                        let a = message.content.split(' ')
                        if (a[a.length - 1] === "everyone=True") {
                            await getChannel.send({content: "@everyone", embeds: [embed]})
                        } else {
                            await getChannel.send({embeds: [embed]})
                        }

                        logs.push(`[Log] '${guild.name}' 서버로 성공적으로 공지가 전송되었습니다! 🟢\n`)
                    } catch (e) {
                        logs.push(`[Log] 알 수 없는 이유로 '${guild.name}' 서버로 공지를 전송하지 못했습니다. 🔴
                                   \n오류 내용 : ${e}\n`)
                    }
            })
            fs.writeFileSync(`${process.cwd()}/ignore/broadcastLog-${new Date().getTime() / 1000}.txt`, '\ufeff' + logs.join('\n'), {encoding: 'utf8'});
            await message.channel.send({content: `\`\`\`${logs.join('\n')}\`\`\``})
        } else {
            await message.reply({content: '⛔ You do not have the `Bot OWNER` permission'})
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