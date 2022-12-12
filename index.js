const fetch = require('./fetch-ex');
let Client = require('ssh2-sftp-client');
let sftp = new Client();

sftp.on('close', () => {
    console.log('connection closed');
});

const config = {
    host: 'www.crossmatch.com', // non-existing anymore
    username: 'Max-AltusAddons', // no such user anymore
    password: 'Zakhar@zhe=vskiy!' // old password before ssh
};

const REMOTE_ROOT_URL = "/AltusAddons/g01/current";


function connectFtp() {
    return sftp.connect(config);
}

async function listDir() {
    try {
        await connectFtp();
        const list = await sftp.list(REMOTE_ROOT_URL);
        console.log(list, 'the data info');
        await sftp.end();
        return true;
    } catch (err) {
        console.log(err, 'catch error');
        await sftp.end();
        return false;
    }
}

const commandLine = {
    "files": [
        {
            "local": "./test/dppm-3.0.235_on_2018.07.11-r-chrome.zip",
            "remote": "/AltusAddons/g01/current/dppm-3.0.235_on_2018.07.11-r-chrome.zip"
        }
    ]
};

const path = require('path');

function setupNames() {
    commandLine.files.forEach(entry => {
        entry.local =  path.join(__dirname, entry.local);
    });    
    console.log(commandLine.files);
}

async function laodConfig() {
    const name = 'file:///' + __dirname + '/test/qa-config.json';
    const raw = await fetch(name);
    const json = await raw.json();
    console.log(json);
}

async function uploadFiles() {
    try {
        await sftp.connect(config);

        // commandLine.files.forEach((entry) => {
        //     await sftp.fastPut(entry.local, entry.remote);
        // });

        await Promise.all(commandLine.files.map(async entry => {
            await sftp.fastPut(entry.local, entry.remote);
        }));

    } catch(err) {
        console.log('error: ', err);
    }
    await sftp.end();
}

async function main() {
    // const result = await listDir();
    // console.log('result: ', result);

    //laodConfig();

    setupNames();
    uploadFiles();
}

main();
