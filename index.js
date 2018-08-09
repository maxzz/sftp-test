const fetch = require('node-fetch');
let Client = require('ssh2-sftp-client');
let sftp = new Client();

sftp.on('close', () => {
    console.log('connection closed');
});

// OK
// sftp.connect({
//     host: 'www.crossmatch.com',
//     username: 'Max-AltusAddons',
//     password: 'Zakharzhevskiy!'
// }).then(() => {
//     return sftp.list('/AltusAddons/g01/current');
// }).then((data) => {
//     console.log(data, 'the data info');
//     sftp.end();
// }).catch((err) => {
//     console.log(err, 'catch error');
// });

// OK
// async function listDir() {
//     try {
//         await sftp.connect({
//             host: 'www.crossmatch.com',
//             username: 'Max-AltusAddons',
//             password: 'Zakharzhevskiy!'
//         });
//         const list = await sftp.list('/AltusAddons/g01/current');
//         console.log(list, 'the data info');
//         await sftp.end();
//         return true;
//     } catch (err) {
//         console.log(err, 'catch error');
//         await sftp.end();
//         return false;
//     }
// }

// async function upload() {
    
// }

// async function main() {
//     const result = await listDir();
//     console.log('result: ', result);
// }

// main();

const config = {
    host: 'www.crossmatch.com',
    username: 'Max-AltusAddons',
    password: 'Zakharzhevskiy!'
};

const REMOTE_ROOT_URL = '/AltusAddons/g01/current';


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

async function upload() {
    const name = 'file:///' + __dirname + '/test/qa-config.json';
    const raw = await fetch(name);
    const json = raw.json();
    console.log(json);
}

async function main() {
    // const result = await listDir();
    // console.log('result: ', result);

    upload();
}


main();
