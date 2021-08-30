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

        if (interaction.isSelectMenu()) {
            if (interaction.customId === "verifyStyle") {
                if (interaction.values[0] === "setV1") {
                    if (gData.verifyStyle === "v1") {
                        await interaction.reply({content: "이미 인증방식이 `v1`로 설정되어 있습니다", ephemeral: true})
                    } else {
                        await interaction.reply({content: "인증방식을 `v1`로 설정하였습니다!", ephemeral: true})

                        await data.findOneAndUpdate({ guildID: interaction.guild.id }, {
                            $set: {
                                verifyStyle: "v1"
                            }
                        })
                    }
                } else if (interaction.values[0] === "setV2") {
                    if (gData.verifyStyle === "v2") {
                        await interaction.reply({content: "이미 인증방식이 `v2`로 설정되어 있습니다", ephemeral: true})
                    } else {
                        await interaction.reply({content: "인증방식을 `v2`로 설정하였습니다!", ephemeral: true})

                        await data.findOneAndUpdate({ guildID: interaction.guild.id }, {
                            $set: {
                                verifyStyle: "v2"
                            }
                        })
                    }
                }
            }
        }
    }
}