const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const { Permissions } = require('discord.js')

const config = require("../../../data/config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('도움말')
        .setDescription('캡챠의 도움말을 가져옵니다.')
        .setDefaultPermission(false),
    async execute(interaction) {
        if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            const help = new Discord.MessageEmbed()
            help.setColor("RANDOM")
                .setAuthor("도움말")


                .setTimestamp()
                .setFooter(`개발자 : ${interaction.client.users.cache.find(user => user.id === config.owner).tag}`)
            await interaction.reply({embeds: [help], ephemeral: true})
        } else {
            await interaction.reply({ content: '⛔ You do not have the `ADMINISTRATOR` permission', ephemeral: true })
        }
    },
};
