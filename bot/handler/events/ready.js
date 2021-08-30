const {commandFiles} = require("../../index")
const config = require('../../../data/config.json')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        // Ready

        console.log('------')
        console.log('Logged in as')
        console.log(client.user.tag)
        console.log(client.user.id)
        console.log(`${client.guilds.cache.size}개의 서버에서 봇이 동작중입니다.`)
        console.log('------')
        console.log(`Node.js 버전 : ${process.version} |권장 : 16.8.0|`)
        console.log(`Discord.js 버전 : ${undefined} |권장 : 13.1.0|`)
        console.log(`[${client.user.tag}] 버전 : ${require("../../../package.json").version}`)
        console.log('------')
        for (const cmd of commandFiles) {
            console.log(`명령어 : '${cmd.replace('.js', '')}' (이)가 로드되었습니다!`)
        }
        console.log("-----")

        await sleep(2000)
        while (true) {
            if (client.isReady()) {
                try {
                    client.user.setPresence({
                        status: "online",
                        activities: [{
                            name: `개발자 : ${client.users.cache.find(user => user.id === `${config.owner}`).tag}`,
                            type: "PLAYING"
                        }]
                    })
                    await sleep(5000)

                    client.user.setPresence({
                        status: "online",
                        activities: [{
                            name: '사이트 : https://vcaptcha.xyz',
                            type: "PLAYING"
                        }]
                    })
                    await sleep(5000)

                    client.user.setPresence({
                        status: "online",
                        activities: [{
                            name: `'${client.guilds.cache.size}'개의 서버에서 운영`,
                            type: "PLAYING"
                        }]
                    })
                    await sleep(5000)

                    // client.user.setPresence({
                    //     status: "dnd",
                    //     activities: [{name: 'veryCAPTCHA v2 BETA!', type: "LISTENING"}]
                    // })
                    // await sleep(5000)
                } catch (e) {
                    console.log(e)
                    break
                }
            }
        }
    },
};