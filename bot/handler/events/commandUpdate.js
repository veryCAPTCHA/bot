const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Json Files
const config = require("../../../data/config.json")

const commands = [];
const commandFiles = fs.readdirSync(`${process.cwd()}/bot/handler/Slash`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`${process.cwd()}/bot/handler/Slash/${file}`);
    commands.push(command.data.toJSON());
}

module.exports = {
    name: "messageCreate",
    execute(message) {
        if (message.content.startsWith("/갱신")) {
            const rest = new REST({ version: '9' }).setToken(config.token);

            (async () => {
                try {
                    await rest.put(
                        Routes.applicationGuildCommands("859253614295646288", message.guild.id),
                        { body: commands },
                    );

                    await message.reply({content: "업데이트 완료!"});
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    }
}
