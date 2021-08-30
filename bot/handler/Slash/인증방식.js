const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')
const { Permissions } = require('discord.js')

const config = require("../../../data/config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('인증방식')
        .setDescription('캡챠의 인증방식을 설정합니다.'),
    async execute(interaction, gData) {
        if (interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            const select = new Discord.MessageActionRow()
            if (gData.verifyStyle === "v2") {
                select.addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('verifyStyle')
                        .setPlaceholder('옵션을 선택해 주세요!')
                        .addOptions([
                            {
                                label: 'v1',
                                description: "'veryCAPTCHA v1'의 인증방식으로 설정합니다.",
                                value: 'setV1',
                            },
                            {
                                label: 'v2',
                                description: "'veryCAPTCHA v2'의 인증방식으로 설정합니다. (설정됨)",
                                value: 'setV2',
                            },
                        ]),
                );
            } else if (gData.verifyStyle === "v1") {
                select.addComponents(
                    new Discord.MessageSelectMenu()
                        .setCustomId('verifyStyle')
                        .setPlaceholder('옵션을 선택해 주세요!')
                        .addOptions([
                            {
                                label: 'v1',
                                description: "'veryCAPTCHA v1'의 인증방식으로 설정합니다. (설정됨)",
                                value: 'setV1',
                            },
                            {
                                label: 'v2',
                                description: "'veryCAPTCHA v2'의 인증방식으로 설정합니다. ",
                                value: 'setV2',
                            },
                        ]),
                );
            }

            const verifyStyle = new Discord.MessageEmbed()
            verifyStyle.setColor("RANDOM")
                .setTitle("인증 방식을 설정해 주세요!")


                .setTimestamp()
                .setFooter(`개발자 : ${interaction.client.users.cache.find(user => user.id === config.owner).tag}`)
            await interaction.reply({embeds: [verifyStyle], ephemeral: true, components: [select]})
        } else {
            await interaction.reply({ content: '⛔ You do not have the `ADMINISTRATOR` privilege', ephemeral: true })
        }
    },
};