const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const data = require("../../captchaData")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('삭제')
        .setDescription('인증하기 위한 Embed를 삭제 합니다.'),
    async execute(interaction, gData) {
        if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            const getGuildID = interaction.guild.id

            try {
                await interaction.client.channels.cache.get(gData.createdChannelID).messages.fetch(gData.createdMessageID).then(msg => {msg.delete()})

                await data.findOneAndUpdate({guildID: getGuildID}, {
                    $unset: {
                        createdChannelID: 1,
                        createdMessageID: 1,
                        customId: 1
                    }})
                await interaction.reply({content: "삭제 완료!", ephemeral: true})
            } catch (e) {
                await interaction.reply({content: `삭제 실패... ${e}`, ephemeral: true})
            }
        } else {
            await interaction.reply({content: '⛔ You do not have the `ADMINISTRATOR` permission', ephemeral: true})
        }
    },
}
