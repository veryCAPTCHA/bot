const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const { Permissions } = require('discord.js')
const data = require("../../captchaData")

const config = require("../../../data/config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('미리보기')
        .setDescription('설정한 정보를 가져옵니다.'),
    async execute(interaction) {
        if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            const getGuildID = interaction.guild.id

            let gData
            try {
                gData = await data.findOne({ guildID: getGuildID })
                if (!gData) {
                    let gDataN = await data.create({
                        guildID: getGuildID
                    })
                    await gDataN.save()
                }
            } catch (e) {
                console.log(e)
            }

            const c = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('StartVerifySample')
                        .setLabel(gData.buttonLabel)
                        .setStyle('PRIMARY')
                        .setEmoji(gData.buttonEmoji)
                )

            const preview = new Discord.MessageEmbed()
            preview.setColor("GREEN")
                .setAuthor(gData.embedTitle)
                .addField("내용", `${gData.embedField}`)
                .setTimestamp()
                .setFooter(`개발자 : ${interaction.client.users.cache.find(user => user.id === config.owner).tag}`)
            await interaction.reply({embeds: [preview], ephemeral: true, components: [c]})
        } else {
            await interaction.reply({ content: '⛔ You do not have the `ADMINISTRATOR` privilege', ephemeral: true })
        }
    },
};