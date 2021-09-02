const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const { Permissions } = require('discord.js')
const data = require("../../captchaData")

const config = require("../../../data/config.json")
const {roleMention} = require("@discordjs/builders");

function emoji(interaction) {
    try {
        if (escape(interaction.options.get("이모지").value).startsWith("%u")) {
            return interaction.options.get("이모지").value
        } else if (interaction.options.get("이모지").value.startsWith("<:")) {
            if (interaction.options.get("이모지").value.endsWith(">")) {
                return interaction.options.get("이모지").value
            }
        }
    } catch (Exception) {
        return "✅"
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('설정')
        .setDescription('캡챠 정보를 설정합니다.')
        .addStringOption(option => option.setName("제목").setDescription("Embed의 제목을 설정합니다").setRequired(true))
        .addStringOption(option => option.setName("설명").setDescription("Embed의 Field를 설정합니다").addChoice("/내용수정 <내용> 으로 수정해 주세요!", "TODO").setRequired(true))
        .addRoleOption(option => option.setName("역할").setDescription("인증후 적용될 역할을 설정합니다").setRequired(true))
        .addStringOption(option => option.setName("이모지").setDescription("인증 하기 위해 누르는 반응의 이모티콘을 설정합니다 (기본 : ✅)")),
    async execute(interaction) {
        if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {

            const getGuildID = interaction.guild.id
            await data.findOneAndUpdate({ guildID: getGuildID }, {
                $set: {
                    embedTitle: interaction.options.get("제목").value,
                    embedField: interaction.options.get("설명").value.toString().replaceAll('\\n', '\n'),
                    embedRole: interaction.options.get("역할").value,
                    buttonEmoji: emoji(interaction)
                }
            })

            try {
                const settings = new Discord.MessageEmbed()
                settings.setColor("RANDOM")
                    .setTitle("<a:Check_Mark:857300578383822868> 설정이 완료되었습니다!")

                    .addField("제목", interaction.options.get("제목").value)
                    .addField("설명", interaction.options.get("설명").value.toString().replaceAll('\\n', '\n'))
                    .addField("역할", roleMention(interaction.options.get("역할").value))
                    .addField("이모지", emoji(interaction))


                    .setTimestamp()
                    .setFooter(`개발자 : ${interaction.client.users.cache.find(user => user.id === config.owner).tag}`)

                await interaction.reply({embeds: [settings], ephemeral: true})
            } catch (e) {
                await interaction.reply({content: `오류 발생! 다시입력해 주세요! ${e}`, ephemeral: true})
            }
        } else {
            await interaction.reply({content: '⛔ You do not have the `ADMINISTRATOR` permission', ephemeral: true})
        }
    },
};
