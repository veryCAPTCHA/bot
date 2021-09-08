const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const { Permissions } = require('discord.js')
const data = require("../../captchaData")

const config = require("../../../data/config.json")

function randomString(length) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
    const stringLength = length
    let randomstring = ''
    for (let i = 0; i < stringLength; i++) {
        const num = Math.floor(Math.random() * chars.length)
        randomstring += chars.substring(num, num + 1)
    }
    return randomstring
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('생성')
        .setDescription('인증하기 위한 Embed를 해당 명령어를 입력한 채널에 생성 합니다.'),
    async execute(interaction, gData) {
        if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            const getGuildID = interaction.guild.id
            const random = randomString(12)

            const c = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(random)
                        .setLabel(gData.buttonLabel)
                        .setStyle('PRIMARY')
                        .setEmoji(gData.buttonEmoji)
                )

            const verify = new Discord.MessageEmbed()
            verify.setColor("GREEN")
                .setAuthor(gData.embedTitle)
                .addField("내용", `${gData.embedField}`)
                .setTimestamp()
                .setFooter(`개발자 : ${interaction.client.users.cache.find(user => user.id === config.owner).tag}`)
            try {
                await interaction.channel.send({embeds: [verify], components: [c]}).then(async (msg) => {
                    await data.findOneAndUpdate({ guildID: getGuildID }, {
                        $set: {
                            createdChannelID: msg.channel.id,
                            createdMessageID: msg.id,
                            customId: random
                        }
                    })
                })
                await interaction.reply({content: "생성 완료!", ephemeral: true})
            } catch (e) {
                await interaction.reply({content: "생성 실패...", ephemeral: true})
            }
        } else {
            await interaction.reply({ content: '⛔ You do not have the `ADMINISTRATOR` permission', ephemeral: true })
        }
    },
};
