const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const data = require("../../captchaData")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('인증초기화')
        .setDescription('캡챠로 인증한 유저 데이터를 초기화 합니다 (역할은 초기화 안됨)')
        .addBooleanOption(option => option.setName("초기화취소").setDescription("잘못입력하여 데이터가 초기화되는 것을 방지합니다 (초기화 하려면 False를 입력해 주세요)").setRequired(true)),
    async execute(interaction) {
        if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            const getGuildID = interaction.guild.id

            if (!interaction.options.get("확인")) {
                await data.findOneAndUpdate({guildID: getGuildID}, {
                    $set: {
                        verifiedUser: []
                    }
                })
                await interaction.reply({content: "초기화 완료!", ephemeral: true})
            }
        } else {
            await interaction.reply({content: '⛔ You do not have the `ADMINISTRATOR` privilege', ephemeral: true})
        }
    },
}