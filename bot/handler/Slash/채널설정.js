const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const { Permissions } = require('discord.js')
const data = require("../../captchaData")

const config = require("../../../data/config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('채널설정')
        .setDescription('봇 공지를 받을 채널을 설정합니다.')
        .addChannelOption(option => option.setName("채널").setDescription("공지를 받을 채널을 설정해 주세요 (기본: 봇-공지)").setRequired(true)),
    async execute(interaction) {
        if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            let getChannel = interaction.guild.channels.cache.find(c => c.id === interaction.options.get("채널").value)
            if (getChannel.isText()) {
                const channel = new Discord.MessageEmbed()
                channel.setColor("RANDOM")
                    .setAuthor("공지채널이 변경되었습니다!")
                    .setTimestamp()
                    .setFooter(`개발자 : ${interaction.client.users.cache.find(user => user.id === config.owner).tag}`)
                await data.findOneAndUpdate({guildID: interaction.guild.id}, {
                    $set: {
                        broadcastChannel: getChannel.name
                    }
                })
                await interaction.reply({embeds: [channel], ephemeral: true})
            } else {
                await interaction.reply({content: "텍스트 채널만 가능합니다", ephemeral: true})
            }
        } else {
            await interaction.reply({ content: '⛔ You do not have the `ADMINISTRATOR` permission', ephemeral: true })
        }
    },
};