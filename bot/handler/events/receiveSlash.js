module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        // Receive Interaction(SlashCommand)

        if (!interaction.isCommand()) return;

        const {commandName} = interaction

        const command = interaction.client.commands.get(commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            return interaction.reply({content: '알 수 없는 오류가 발생하였습니다!', ephemeral: true});
        }
    }
}