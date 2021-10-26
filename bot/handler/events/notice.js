const Discord = require('discord.js')
const fs = require("fs")

const config = require("../../../data/config.json")

module.exports = {
    name: "messageCreate",
    async execute(message) {
        // messageCreate (notice)
        if (message.content.startsWith("$봇공지 ")) {
            if (message.author.id === config.owner) {
                let noticeJson = JSON.parse(fs.readFileSync(`${process.cwd()}/data/noticeData.json`, 'utf-8'))
                const noticeID = Date.now()
                const contents = message.content
                    .replace('$봇공지 ', '')
                    .replaceAll("\\n", "\n")
                noticeJson[noticeID] = contents
                await message.delete()

                const notice = new Discord.MessageEmbed()
                notice.setColor("GREEN")
                    .setAuthor("공지가 등록되었습니다!")
                    .addField(`공지 ID : ${noticeID}`, `\`\`\`${contents}\`\`\``, false)
                    .setTimestamp()
                    .setFooter(`개발자 : ${message.client.users.cache.find(user => user.id === config.owner).tag}`)
                noticeJson = JSON.stringify(noticeJson, null, '\t')
                fs.writeFileSync(`${process.cwd()}/data/noticeData.json`, noticeJson, 'utf-8')
                await message.channel.send({embeds: [notice]})
            } else {
                await message.reply({content: '⛔ You are not `Bot OWNER`'})
            }
        }

        if (message.content.startsWith("$봇공지_제거 ")) {
            if (message.author.id === config.owner) {
                let noticeJson = JSON.parse(fs.readFileSync(`${process.cwd()}/data/noticeData.json`, 'utf-8'))
                const contents = message.content
                    .replace('$봇공지_제거 ', '')

                delete noticeJson[contents]
                await message.delete()

                const notice = new Discord.MessageEmbed()
                notice.setColor("RED")
                    .setAuthor("공지가 삭제되었습니다!")
                    .addField(`공지 ID : ${contents}`, `null`, false)
                    .setTimestamp()
                    .setFooter(`개발자 : ${message.client.users.cache.find(user => user.id === config.owner).tag}`)
                noticeJson = JSON.stringify(noticeJson, null, '\t')
                fs.writeFileSync(`${process.cwd()}/data/noticeData.json`, noticeJson, 'utf-8')
                await message.channel.send({embeds: [notice]})
            } else {
                await message.reply({content: '⛔ You are not `Bot OWNER`'})
            }
        }
    }
}
