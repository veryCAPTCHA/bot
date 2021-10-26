const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const fs = require("fs")

const config = require("../../../data/config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('공지사항')
        .setDescription('최근 5개의 공지사항을 가져옵니다.')
        .addIntegerOption(option => option.setName("개수").setDescription("가져올 공지사항 개수를 설정합니다. (기본 : 5)")),
    async execute(interaction) {
        let notice_count
        try {
            notice_count = interaction.options.get("개수").value
        } catch (e) {
            notice_count = 5
        }

        let noticeList = []
        const noticeData = JSON.parse(fs.readFileSync(`${process.cwd()}/data/noticeData.json`, 'utf-8'))
        const keys = Object.keys(noticeData)
        const Format = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', fractionalSecondDigits: 2, timeZone: 'asia/seoul', timeZoneName: 'short'}
        for (let i = 0; i < notice_count; i++) {
            if (noticeData[keys[i]] !== undefined) {
                const dateFormat = Intl.DateTimeFormat('ko-KR', Format).format(new Date(Number(keys[i])))
                noticeList.push(`+ [ ${dateFormat} ]\n${noticeData[keys[i]]}`)
            }
        }

        const notice = new Discord.MessageEmbed()
        notice.setColor("GOLD")
            .setAuthor("공지사항")
            .addField(`* 최근 ${noticeList.length}개의 공지사항을 가져옵니다.`, `\`\`\`diff\n${noticeList.join('\n\n')}\`\`\``, false)
            .setTimestamp()
            .setFooter(`개발자 : ${interaction.client.users.cache.find(user => user.id === config.owner).tag}`)
        await interaction.reply({embeds: [notice], ephemeral: true})
    },
}
