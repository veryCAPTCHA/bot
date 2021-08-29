const data = require('../../captchaData')

module.exports = {
    name: "guildCreate",
    async execute(guild) {
        // guildCreate
        let gData = await data.create({
            guildID: guild.id
        })
        await gData.save()
    }
}