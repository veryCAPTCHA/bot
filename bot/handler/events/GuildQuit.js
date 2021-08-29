const data = require('../../captchaData')

module.exports = {
    name: "guildDelete",
    async execute(guild) {
        // guildDelete

        await data.findOneAndDelete({ guildID: guild.id })
    }
}