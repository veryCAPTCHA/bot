const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Json Files
const config = require("../../../data/config.json")

const data = require('../../captchaData')

const commands = [];
const commandFiles = fs.readdirSync(`${process.cwd()}/bot/handler/Slash`).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`${process.cwd()}/bot/handler/Slash/${file}`);
    commands.push(command.data.toJSON());
}

module.exports = {
    name: "guildCreate",
    async execute(guild) {
        // guildCreate
        let gData = await data.create({
            guildID: guild.id
        })
        await gData.save()

        const rest = new REST({ version: '9' }).setToken(config.token);

        await (async () => {
            try {
                await rest.put(
                    Routes.applicationGuildCommands("859253614295646288", guild.id),
                    {body: commands},
                );
            } catch (error) {
                console.error(error);
            }
        })();
    }
}
