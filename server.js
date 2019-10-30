
const http = require('http');
const url = require('url');
const fs = require('fs');

const host = '172.25.6.106';
const port = 9999;

// create server
const server = http.createServer((req, res) => {
    var pathname = url.parse(req.url).pathname;
    console.log(`request for ${pathname} received.`);

    var postData = '';
    req.setEncoding('utf-8');
    req.addListener('data', (chunk) => {
        postData += chunk;
        console.log(`receive post data ${chunk}.`);
    });
    req.addListener('end', () => {
        mock(pathname, res, postData);
    });
})

// start server
server.listen(port, host, () => {
    console.log(`server running at ${host}:${port}.`);
});

// response read data
function mock(param, res, postData) {
    var filePath = paramToFileName(param);

    console.log(`about to read file ${filePath}`);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(`fail to read from ${filePath}.`);
            res.writeHead(404, {"Content-Type": "text/plain"});
            res.write("404 Not found");
            res.end();
        } else {
            console.log(`success to read from ${filePath}.`);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(data);
            res.end();
        }
    });
}

// get file name according to url's param.
function paramToFileName(param) {
    param = param.replace(/\//g, '_');

    var pre = './files/';
    var suf = '.json';
    if (param.startsWith('_')) {
        param = param.substr(1, param.length - 1);
    }
    return pre + param + suf;
}
