const data = require('../../captchaData')

module.exports = {
    name: "guildMemberRemove",
    async execute(member) {
        // guildMemberRemove

        await data.findOneAndUpdate({ guildID: member.guild.id }, {
            $pull: {
                verifiedUser: member.id
            }
        })
    }
}