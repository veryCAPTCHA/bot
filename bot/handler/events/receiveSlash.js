const data = require("../../captchaData")

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        // Receive Interaction(SlashCommand)

        if (!interaction.isCommand()) return;

        const {commandName} = interaction

        const command = interaction.client.commands.get(commandName);

        if (!command) return;

        let gData
        try {
            gData = await data.findOne({ guildID: interaction.guild.id })
            if (!gData) {
                let gDataN = await data.create({
                    guildID: interaction.guild.id
                })
                await gDataN.save()
            }
        } catch (e) {
            console.log(e)
        }

        try {
            await command.execute(interaction, gData);
        } catch (error) {
            console.error(error);
            return interaction.reply({content: '알 수 없는 오류가 발생하였습니다!', ephemeral: true});
        }
    }
}