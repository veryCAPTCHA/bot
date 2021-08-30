const data = require("../../captchaData")
const Discord = require("discord.js")

const config = require('../../../data/config.json')

let duringVerify = []

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
                if (duringVerify.indexOf(interaction.member.id)) {

                    duringVerify.push(interaction.member.id)
                    const random = randomString(12)
                    let count = 1
                    try {
                        if (!gData.verifiedUser.indexOf(interaction.member.id)) {
                            const del = duringVerify.indexOf(interaction.member.id)
                            duringVerify.splice(del, 1)

                            await interaction.reply({content: `${interaction.member}님은 이미 인증된 상태입니다!`, ephemeral: true})
                        } else {

                            try {
                                if (gData.verifyStyle === "v1") {
                                    const verify = new Discord.MessageEmbed()
                                    verify.setColor("GREEN")
                                        .setAuthor(gData.embedTitle)
                                        .addField("내용", `${gData.embedField}`, false)
                                        .addField("보안코드를 대소문자 구별하여 입력해주세요! (제한시간 : 60초)", `\`${random}\``)
                                        .setTimestamp()
                                        .setFooter(`개발자 : ${interaction.client.users.cache.find(user => user.id === config.owner).tag}`)
                                    let vMsg = await interaction.member.send({embeds: [verify]})

                                    const collector = new Discord.MessageCollector(await vMsg.channel, {
                                        max: 3,
                                        time: 60000,
                                        filter: m => m.author.id === interaction.member.id
                                    })

                                    collector.on('collect', async message => {
                                        if (message.content === random) {
                                            collector.stop("success")
                                        } else if (count < 3) {
                                            await interaction.member.send({content: `❌ 캡챠 인증을 3번 중 '${count}' 번을 틀리셨습니다 다시 입력해 주세요!`})
                                        }
                                        count++
                                    })
                                    collector.on('end', async (collected, reason) => {
                                        if (reason === "time") {
                                            const del = duringVerify.indexOf(interaction.member.id)
                                            duringVerify.splice(del, 1)
                                            await interaction.member.send({content: "시간초과로 인증이 취소되었습니다! 다시 시도해주세요!"}).then(msg => {
                                                setTimeout(() => msg.delete(), 5000)
                                            })
                                        } else if (reason === "limit") {
                                            const del = duringVerify.indexOf(interaction.member.id)
                                            duringVerify.splice(del, 1)
                                            await interaction.member.send({content: "❌ 캡챠 인증을 3번 중 '3' 번을 틀려서 인증이 취소되었습니다. 다시 시도해 주세요!"}).then(msg => {
                                                setTimeout(() => msg.delete(), 5000)
                                            })
                                        } else if (reason === "success") {
                                            try {
                                                const role = interaction.message.guild.roles.cache.find(r => r.id === gData.embedRole);
                                                await interaction.member.roles.add(role)
                                            } catch (e) {
                                                await interaction.member.send({content: `역할을 추가할 수 없습니다... | ${e}`})
                                            }
                                            await data.findOneAndUpdate({guildID: interaction.guild.id}, {
                                                $addToSet: {
                                                    verifiedUser: interaction.member.id
                                                }
                                            })
                                            const del = duringVerify.indexOf(interaction.member.id)
                                            duringVerify.splice(del, 1)
                                            await interaction.member.send({content: "인증이 완료되었습니다!"}).then(msg => {
                                                setTimeout(() => msg.delete(), 5000)
                                            })
                                        }
                                    })
                                }

                                await interaction.reply({content: "<a:Check_Mark:857300578383822868> 인증 메시지를 보냈습니다\n\n`DM을 확인해 주시기 바랍니다!`", ephemeral: true})
                            } catch (e) {
                                const del = duringVerify.indexOf(interaction.member.id)
                                duringVerify.splice(del, 1)

                                await interaction.reply({content: `인증을 완료할 수 없습니다\n오류 : ${e}`, ephemeral: true})
                            }
                        }
                    } catch (e) {
                        const del = duringVerify.indexOf(interaction.member.id)
                        duringVerify.splice(del, 1)

                        await interaction.reply({content: "정보를 가져올 수 없습니다.", ephemeral: true})
                    }
                } else {
                    await interaction.reply({content: `${interaction.member}님은 이미 인증이 진행중 입니다`, ephemeral: true})
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