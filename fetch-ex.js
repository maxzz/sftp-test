//https://gist.github.com/joshua-gould/58e1b114a67127273eef239ec0af8989
const fs = require('fs');
const path = require('path');
const nodeFetch = require('node-fetch');
const Request = nodeFetch.Request;
const Response = nodeFetch.Response;

module.exports = function fetch(url, options) {
    const request = new Request(url, options);
    if (request.url.substring(0, 5) === 'file:') {
        return new Promise((resolve, reject) => {
            const filePath = path.normalize(url.substring('file:///'.length));
            if (!fs.existsSync(filePath)) {
                reject(`File not found: ${filePath}`);
            }
            const readStream = fs.createReadStream(filePath);
            readStream.on('open', function () {
                resolve(new Response(readStream, {
                    url: request.url,
                    status: 200,
                    statusText: 'OK',
                    size: fs.statSync(filePath).size,
                    timeout: request.timeout
                }));
            });
        });
    } else {
        return nodeFetch(url, options);
    }
};
