'use strict';

/*
  Author: Anjan Roy <anjanroy@yandex.com>
*/

const express = require('express');
const http = require('http');
const https = require('https');
const readFile = require('fs').readFileSync;
const sqlite = require('sqlite3');
const app = express();

// good to set it, when deploying in production
app.set('env', 'production');

let db; // connection to database

// enabled https ;)
const options = {
  key: readFile('/home/ubuntu/.sslcert/itzmeanjan.in/privkey.pem'),
  cert: readFile('/home/ubuntu/.sslcert/itzmeanjan.in/fullchain.pem'),
  ca: readFile('/home/ubuntu/.sslcert/itzmeanjan.in/chain.pem')
}


/** 
 * connects to database, and invokes callback when done
 * @param {Function} callback - callback function
 */
function connect(callback) {
  db = new sqlite.Database("stat.sqlite3", callback);
}

/**
 * creates database table, where records to be put
 */
function create() {
  db.run(`create table if not exists itzmeanjan_in (id integer primary key autoincrement, method text not null, url text not null, ip text not null, time integer not null);`, (e) => {
    return e ? console.log(e) : console.log("created");
  });
}

/**
 * @param {string} method - Http method
 * @param {string} url - url path accessed by remote
 * @param {string} ip - ip address of remote
 * @param {number} time - timestamp of access
 */
function insert(method, url, ip, time) {
  db.run(`insert into itzmeanjan_in (method, url, ip, time) values(?, ?, ?, ?);`,
    [method, url, ip, time],
    (e) => {
      if (e) {
        console.log(e);
      }
    });
}

function close() {
  db.close((e) => {
    console.log(e ? e : "closed");
    process.exit(0);
  });
}

connect(create);
process.on('SIGINT', close);


// this middleware will help me logging access stat,
// so that later on I can analyze site traffic ( if I ever need to :) )
function writeLog(req, res, next) {
  insert(req.method, req.url, req.ip, Date.now());
  //console.log(`${req.method} | ${req.url} | ${req.ip} | ${Date().toString()}`);
  next();
}

// middleware set, all incoming requests should be
// now passing via this middleware
// which will help me in logging website
// traffic
//
// it helped me in redusing size of this script
app.use(writeLog);

app.get('/', (req, res) => {
  res.status(200).contentType('html').sendFile(
    './pages/index.html', { root: __dirname }, (err) => {
      if (err !== undefined && err !== null)
        res.send('Something went wrong').end();
    });
});

app.get('/blog', (req, res) => {
  res.status(200).contentType('html').sendFile(
    './pages/blog.html', { root: __dirname }, (err) => {
      if (err !== undefined && err !== null)
        res.send('Something went wrong').end();
    });
});

app.get('/contact', (req, res) => {
  res.status(200).contentType('html').sendFile(
    './pages/contact.html', { root: __dirname }, (err) => {
      if (err !== undefined && err !== null)
        res.send('Something went wrong').end();
    });
});


app.get('/projects', (req, res) => {
  res.status(200).contentType('html').sendFile(
    './pages/projects.html', { root: __dirname }, (err) => {
      if (err !== undefined && err !== null)
        res.send('Something went wrong').end();
    });
});

app.get('/robots.txt', (req, res) => {
  res.status(200).contentType('text/plain').sendFile(
    './data/robots.txt', { root: __dirname }, (err) => {
      if (err !== undefined && err !== null)
        res.send('Something went wrong').end();
    });
});

// a GET request at this path, will simply return IP address of client
// simply made so that people can check their own public IP address if in need
// well I know, there're thousands of services, providing same/ much more functionalities
// but still it's a small venture
app.get('/ip', (req, res) => {
  res.status(200).contentType('json').json(
    {
      ip: req.ip
    }
  );
  res.end();
});

app.get('(/blog)?/common.css', (req, res) => {
  res.status(200).sendFile('./styles/common.css', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/myImage.jpg', (req, res) => {
  res.status(200).sendFile('./images/myImage.jpg', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/myResume.pdf', (req, res) => {
  res.status(200).sendFile('./cv/myResume.pdf', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/projects.json', (req, res) => {
  res.status(200).sendFile('./data/projects.json', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/projects.js', (req, res) => {
  res.status(200).sendFile('./scripts/projects.js', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/blog.json', (req, res) => {
  res.status(200).sendFile('./data/blog.json', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/blog.js', (req, res) => {
  res.status(200).sendFile('./scripts/blog.js', { root: __dirname },
    (err) => { res.end(); });
});

// any GET request, which is not supported
// i.e. request for a wrong path, will make
// them receive following text/plain message,
// with 404 content type
app.get('*', (req, res) => {
  res.status(404).contentType('text/plain').write("You're on wrong track :)");
  res.end();
});

https.createServer(options, app).listen(8000, '0.0.0.0',
  () => { console.log('[+]HTTPS Server started\n') });

// will run a handler server on 8001 port, so that
// all traffics incoming via port 80 ( which is HTTP port )
// gets redirected into port 443 ( which is HTTPS )
// 
// Any previous link, spread on internet
// need to be handler properly, which is why
// I'm using this HTTP traffic handler server

http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(8001, '0.0.0.0',
  () => { console.log('[+]HTTP Server started\n') });
