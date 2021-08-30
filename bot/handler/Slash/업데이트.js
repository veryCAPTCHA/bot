const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const { Permissions } = require('discord.js')

const config = require("../../../data/config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('업데이트')
        .setDescription('인증하기 위한 Embed를 최신 데이터로 업데이트 됩니다'),
    async execute(interaction, gData) {
        if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            const verify = new Discord.MessageEmbed()
            verify.setColor("GREEN")
                .setAuthor(gData.embedTitle)
                .addField("내용", `${gData.embedField}`)
                .setTimestamp()
                .setFooter(`개발자 : ${interaction.client.users.cache.find(user => user.id === config.owner).tag}`)
            try {
                await interaction.client.channels.cache.find(c => c.id === gData.createdChannelID)
                    .messages.cache.find(m => m.id === gData.createdMessageID).edit({embeds: [verify]})
                await interaction.reply({content: "업데이트 완료!", ephemeral: true})
            } catch (e) {
                await interaction.reply({content: "업데이트 실패...", ephemeral: true})
            }
        } else {
            await interaction.reply({ content: '⛔ You do not have the `ADMINISTRATOR` privilege', ephemeral: true })
        }
    },
};