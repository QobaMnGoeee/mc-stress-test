const mineflayer = require('mineflayer');

const botNames = [
    "NomadKazakh", "BozingirBot", "QaraqalpaqBek", "JailauRunner", "TuranGuard"
];

const config = {
    host: "ZeroWorldGG.aternos.me",
    port: 12267,
    version: "1.20.1",
    password: "qwertyba"
};

console.log("==========================================");
console.log("TEST STARTED");
console.log("==========================================\n");

botNames.forEach((name, index) => {
    setTimeout(() => createBot(name), index * 10000);
});

function createBot(name) {
    console.log(`[...] ${name} connecting...`);

    let registered = false;
    let loggedIn = false;

    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: name,
        version: config.version,
        auth: "offline",
        keepAlive: true,
        viewDistance: "tiny"
    });

    bot.on("login", () => {
        console.log(`[OK] ${name} joined the server.`);
    });

    bot.on("message", (jsonMsg) => {
        const msg = jsonMsg.toString().toLowerCase();
        console.log(`[MSG] ${name}: ${jsonMsg.toString()}`);

        if (msg.includes("antibot")) {
            console.log(`[ANTIBOT] ${name}: AntiBot detected! Waiting.`);
            return;
        }

        if ((msg.includes("/register")) && !registered) {
            registered = true;
            setTimeout(() => {
                try {
                    bot.chat(`/register ${config.password} ${config.password}`);
                    console.log(`[REG] ${name} sent /register`);
                } catch (e) {
                    console.log(`[WARN] ${name} /register failed: bot disconnected`);
                }
            }, 2000);
        } else if ((msg.includes("/login")) && !loggedIn) {
            loggedIn = true;
            setTimeout(() => {
                try {
                    bot.chat(`/login ${config.password}`);
                    console.log(`[LOGIN] ${name} sent /login`);
                } catch (e) {
                    console.log(`[WARN] ${name} /login failed: bot disconnected`);
                }
            }, 2000);
        }
    });

    bot.on("spawn", () => {
        console.log(`[SPAWN] ${name} spawned!`);
    });

    bot.on("end", (reason) => {
        console.log(`[END] ${name} disconnected: ${reason || "unknown reason"}`);
        bot.removeAllListeners();
        setTimeout(() => createBot(name), 30000);
    });

    bot.on("error", (err) => {
        const errMsg = (err && err.message) ? err.message : String(err);
        console.log(`[ERR] ${name} error: ${errMsg}`);
    });
}