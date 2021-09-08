const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../../data/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('veryCAPTCHA의 핑을 가져옵니다.'),
    async execute(interaction) {
        await interaction.reply({content: `${interaction.client.ws.ping}ms!`, ephemeral: true})
    },
};
