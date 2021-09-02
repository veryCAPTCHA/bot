const fs = require('fs')
const data = require('../../captchaData')
const { Permissions, MessageEmbed } = require('discord.js')

// Json Files
const config = require("../../../data/config.json")

async function getChannelName(guildId) {
    let gData
    try {
        gData = await data.findOne({guildID: guildId})
        if (!gData) {
            let gDataN = await data.create({
                guildID: guildId
            })
            await gDataN.save()
        }
    } catch (e) {
        console.log(e)
    }

    return gData.broadcastChannel
}

module.exports = {
    name: "messageCreate",
    async execute(message) {
        // messageCreate (broadcast)

        if (message.content.startsWith("$봇공지")) {
            let logs = []
            if (message.author.id === config.owner) {
                let contents = message.content
                    .replace('$봇공지 ', '')
                    .replace('everyone=True', '')
                    .replaceAll("\\n", "\n")
                await message.delete()
                message.client.guilds.cache.each(async guild => {
                    let channelName = await getChannelName(guild.id)
                    let everyoneRole = guild.roles.cache.find(r => r.name === '@everyone');

                    logs.push(`[Log] '서버 : ${guild.name}' 이(가) 수신되었습니다. 🟢`)
                    try {
                        logs.push(`[Log] '${guild.name}' 로 공지를 보낼 채널을 찾고 있습니다. 💬`)
                        if (!guild.channels.cache.find(c => c.name === channelName)) {
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

                        setTimeout(async () => {
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
                                .setFooter(`작성자 : ${message.author.tag} | 개발자 : ${message.client.users.cache.find(user => user.id === config.owner).tag}`, avatarURL)

                            let a = message.content.split(' ')
                            let getChannel = guild.channels.cache.find(c => c.name === channelName)
                            if (a[a.length - 1] === "everyone=True") {
                                await getChannel.send({content: "@everyone", embeds: [embed]})
                            } else {
                                await getChannel.send({embeds: [embed]})
                            }
                        }, 500)

                        logs.push(`[Log] '${guild.name}' 서버로 성공적으로 공지가 전송되었습니다! 🟢\n`)
                    } catch (e) {
                        logs.push(`[Log] 알 수 없는 이유로 '${guild.name}' 서버로 공지를 전송하지 못했습니다. 🔴
                                   \n오류 내용 : ${e}\n`)
                    }

                })
                setTimeout(async () => {
                    fs.writeFileSync(`${process.cwd()}/ignore/broadcastLog-${new Date().getTime() / 1000}.txt`, '\ufeff' + logs.join('\n'), {encoding: 'utf8'});
                    await message.channel.send({content: `\`\`\`${logs.join('\n')}\`\`\``})
                }, (500 * message.client.guilds.cache.size) + 2000)

            } else {
                await message.reply({content: '⛔ You do not have the `Bot OWNER` permission'})
            }
        }
    }
}
