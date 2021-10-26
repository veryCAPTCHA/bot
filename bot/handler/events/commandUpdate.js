const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Permissions } = require('discord.js')

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
            if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                const rest = new REST({version: '9'}).setToken(config.token);

                (async () => {
                    try {
                        await rest.put(
                            Routes.applicationGuildCommands(message.client.user.id, message.guild.id),
                            {body: commands},
                        );

                        await message.reply({content: "업데이트 완료!"});
                    } catch (error) {
                        console.error(error);
                    }
                })();
            }
        }

        if (message.content.startsWith("/ForceUpdateCommand")) {
            if (message.author.id === config.owner) {
                const rest = new REST({version: '9'}).setToken(config.token);

                message.client.guilds.cache.each(async guild => {
                    try {
                        await rest.put(
                            Routes.applicationGuildCommands(message.client.user.id, guild.id),
                            {body: commands},
                        );
                    } catch (error) {
                        console.error(error);
                    }
                })
            }
        }
    }
}
