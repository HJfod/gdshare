const notifier = require("node-notifier");
const path = require("path");
const fs = require("fs");

const app = JSON.parse(fs.readFileSync("auto-backup.json", "utf-8"));
const id = `GDShare Auto-Backup ${require("./package.json").version}`;
const GDcheckRate = 5000;

try {
    let make = false;
    if (app.lastBackup) {
        if (
            (Math.round(+ new Date() / 1000 / 86400) - app.lastBackup) > app.createRate
        ) {
            make = true;
        }
    } else {
        make = true;
    }
    if (app.createOnGDClose) make = false;

    if (make) {
        try {
            const time = new Date();
            let dir = `${app.dest}/GDSHARE_BACKUP_${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`;
            
            let n = 1;
            while (fs.existsSync(dir)) {
                n++;
                dir = dir.includes("#") ? dir.substring(0,dir.length-dir.split("#").pop().length-1) : dir;
                dir = dir + `#${n}`;
            }
            fs.mkdirSync(dir);
    
            [ `${app.src}/CCLocalLevels.dat`, `${app.src}/CCGameManager.dat` ].forEach(f => {
                const data = fs.readFileSync(f);
                fs.writeFileSync(`${dir}/${f.split("/").pop()}`, data);
            });
    
            const data = JSON.parse(fs.readFileSync("auto-backup.json", "utf8"));
            data["lastBackup"] = Math.round(+ new Date() / 1000 / 86400);
            fs.writeFileSync("auto-backup.json", JSON.stringify(data), "utf8");
    
            notifier.notify({
                title: `GD Data has been backed up!`,
                message: `Click to view ${dir}`,
                icon: path.join(__dirname + `/../share.ico`),
                appID: id,
                wait: true
            }, () => {
                require('child_process').exec('start "" "' + dir + '"');
            });

            notifier.on("timeout", (notifierObject, options) => {
                process.exit();
            });
        } catch(e) {
            notifier.notify({
                title: `GD Auto-Backup failed!`,
                message: `${e}`,
                icon: path.join(__dirname + `/../share.ico`),
                appID: id
            });
        }
    }

    if (app.createOnGDClose) {
        checkGDLoop();
    }
} catch (e) { console.error(e) };

function checkGDLoop(collect = 0) {
    setTimeout(() => {
        require("child_process").exec("tasklist", (stdin, stdout, stderr) => {
            if (stdout.toLowerCase().includes("geometrydash.exe")) {
                collect = 1;
            } else {
                if (collect) {
                    console.log("here");
                    notifier.notify({
                        title: "you just closed gd",
                        message: "yeah you did bitch ass i know what you're doing on your pc just look out fuckface",
                        icon: path.join(__dirname + `/../share.ico`),
                        appID: id
                    });
                    collect = 0;
                }
            }
            checkGDLoop(collect);
        });
    }, GDcheckRate);
}