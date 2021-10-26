const Discord = require('discord.js')

const config = require("../../../data/config.json")
const noticeData = require("../../../data/noticeData.json")

module.exports = {
    name: "messageCreate",
    async execute(message) {
        // messageCreate (notice)
        if (message.content.startsWith("$봇공지")) {
            if (message.author.id === config.owner) {
                const noticeID = Date.now()
                const contents = message.content
                    .replace('$봇공지 ', '')
                    .replaceAll("\\n", "\n")
                await message.delete()

                const notice = new Discord.MessageEmbed()
                notice.setColor("GREEN")
                    .setAuthor("공지가 등록되었습니다!")
                    .addField(`공지 ID : ${noticeID}`, `\`\`\`${contents}\`\`\``, false)
                    .setTimestamp()
                    .setFooter(`개발자 : ${message.client.users.cache.find(user => user.id === config.owner).tag}`)
                await message.channel.send({embeds: [notice]})
            } else {
                await message.reply({content: '⛔ You are not `Bot OWNER`'})
            }
        }
    }
}
