const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../../data/config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('DevTest')
        .setDefaultPermission(false),
    async execute(interaction) {
        if (interaction.member.id === config.owner) {
            await interaction.reply({ content: `${interaction.client.ws.ping}ms!`, ephemeral: true })
        } else {
            await interaction.reply({ content: '⛔ You do not have the `Bot OWNER` privilege', ephemeral: true })
        }
    },
};