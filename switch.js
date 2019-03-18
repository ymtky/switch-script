(async() => {
    targetTask = process.argv[2]
    const tasks = require('./tasks.json')
    if (!(targetTask in tasks)) {
        console.log(`${targetTask} is not found`)
        process.exit(1)
    }
    task = tasks[targetTask]

    const execSync = require('child_process').execSync
    const runnningApps = execSync('ps aux | grep -o "/Applications/[^/]*\.app/" | sort | uniq | sed "s/^\\/Applications\\/\\(.*\\).app\\//\\1/g"')
        .toString()
        .trim() 
        .split("\n")
    const ignore_apps = require('./ignore.json')
    for (app of runnningApps) {
        if (!(ignore_apps.includes(app))) {
            try {
                execSync(`killall "${app}"`)
            } catch {
                console.log(`failed to close ${app}`)
            }
        }
    }

    await sleep(1000)

    for (app of task.apps) {
        try {
            if (app.params) {
                execSync(`open -a '${app.name}' ${app.params.join(' ')}`)
            } else {
                execSync(`open -a '${app.name}'`)
            }
        } catch {
            console.log(`failed to open ${app.name}`)
        }
    }
})()

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}