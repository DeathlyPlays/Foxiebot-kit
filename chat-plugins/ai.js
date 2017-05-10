"use strict";

const AI_API = "http://qmarkai.com/qmai.php?q=";
const http = require("http");
Config.settableCommands.ai = true;
Config.customRank.ai = "#";

function askQuestion(q) {
    return new Promise((resolve, reject) => {
        http.get(AI_API + q, res => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => resolve(data));
        });
    });
}

if (!Monitor.AIsetup && ) {
    Monitor.AIsetup = true;
    Events.on(["c", "c:", "pm"], (id, room, msgType, msg) => {
        if (!Config.AIEnabled) return false;
        let isPM = msgType === "pm";

        let parts = msg.split("|");
        if (msgType === "c:") parts.shift();

        let [userid, ...message] = parts;
        let user = Users.get(userid);
        message = message.join("|");
        
        console.log("perms: " + (!isPM && !user.can("ai")))
        console.log("should answer: " + (!isPM && !message.includes(Monitor.username)));

        if ((!isPM && !user.can("ai")) || (!isPM && !message.includes(Monitor.username))) return;

        askQuestion(message.replace(/[^a-z0-9]/i, ""))
            .then(res => {
                res = res.replace(/\n/g, " ");
                if (isPM) {
                    user.sendTo(res);
                } else {
                    room.send(user.userid, res);
                }
            })
            .catch(err => {
                if (isPM) {
                    user.sendTo(`Error: ${err}`);
                } else {
                    room.send(user.userid, `Error: ${err}`);
                }
            });
    });
}

exports.commands = {
    "8ball": function (target, room, user) {
        this.can("ai");

        askQuestion(target.replace(/[^a-z0-9]/i, ""))
            .then(res => {
                res = res.replace(/\n/g, "");
                this.send(res);
            })
            .catch(err => {
                this.send(`Error: ${err}`);
            });
    },
};

