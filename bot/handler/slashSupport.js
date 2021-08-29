const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Json Files
const config = require("../../data/config.json")

const commands = [];
const commandFiles = fs.readdirSync(`${process.cwd()}/bot/handler/Slash`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`${process.cwd()}/bot/handler/Slash/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands("881476730001457172", "754664289708802080"),
            { body: commands },
        );

        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
})();