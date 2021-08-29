const data = require("../../captchaData")

function randomString(length) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
    const stringLength = length
    let randomstring = ''
    for (let i = 0; i < stringLength; i++) {
        const num = Math.floor(Math.random() * chars.length)
        randomstring += chars.substring(num, num + 1)
    }
    return randomstring
}

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        // Receive Interaction(Button)
        const getGuildID = interaction.guild.id
        let gData
        try {
            gData = await data.findOne({guildID: getGuildID})
            if (!gData) {
                let gDataN = await data.create({
                    guildID: getGuildID
                })
                await gDataN.save()
            }
        } catch (e) {
            console.log(e)
        }

        if (interaction.isButton()) {
            if (interaction.customId === "StartVerifySample") {
                try {
                    if (!gData.verifiedUser.indexOf(interaction.member.id)) {
                        await interaction.reply({content: "인증 됨", ephemeral: true})
                    } else {
                        await interaction.reply({content: "인증 안됨", ephemeral: true})
                    }
                } catch (e) {
                    await interaction.reply({content: "정보를 가져올 수 없습니다.", ephemeral: true})
                }
            }
            if (interaction.customId === gData.customId) {
                try {
                    if (!gData.verifiedUser.indexOf(interaction.member.id)) {
                        await interaction.reply({content: "인증 됨", ephemeral: true})
                    } else {
                        await interaction.reply({content: "인증 안됨", ephemeral: true})
                    }
                } catch (e) {
                    await interaction.reply({content: "정보를 가져올 수 없습니다.", ephemeral: true})
                }
            }
        }
    }
}