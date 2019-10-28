'use strict';

/*
  Author: Anjan Roy <anjanroy@yandex.com>
*/

const express = require('express');
const http = require('http');
const https = require('https');
const readFile = require('fs').readFileSync;
const app = express();

// good to set it, when deploying in production
app.set('env', 'production');

// enabled https ;)
const options = {
  key: readFile('/etc/letsencrypt/live/itzmeanjan.in/privkey.pem'),
  cert: readFile('/etc/letsencrypt/live/itzmeanjan.in/fullchain.pem'),
  ca: readFile('/etc/letsencrypt/live/itzmeanjan.in/chain.pem')
}

// this middleware will help me logging access stat,
// so that later on I can analyze site traffic ( if I ever need to :) )
function writeLog(req, res, next) {
  console.log(`${req.method} | ${req.url} | ${req.ip} | ${Date().toString()}`);
  next();
}

// middleware set, all incoming requests should be
// now passing via this middleware
// which will help me in logging website
// traffic
//
// it helped me in redusing size of this script
app.use(writeLog);

// redirects all HTTP traffic to HTTPS
let http2https = express.Router();
http2https.get('*', (req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
});

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

app.get('/data', (req, res) => {
  res.status(200).contentType('html').sendFile(
    './pages/data.html', { root: __dirname }, (err) => {
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

app.get('/blog/post_:id.json', (req, res) => {
  res.status(200).sendFile(`./blog/post_${req.params.id}.json`, { root: __dirname },
    (err) => { res.end(); });
});

app.get('/blog/post_:id', (req, res) => {
  res.status(200).contentType('html').sendFile(
    './pages/post.html', { root: __dirname }, (err) => {
      if (err !== undefined && err !== null)
        res.send('Something went wrong').end();
    });
});

app.get('(/blog)?/common.css', (req, res) => {
  res.status(200).sendFile('./styles/common.css', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/blog/post.css', (req, res) => {
  res.status(200).sendFile('./styles/post.css', { root: __dirname },
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

app.get('/blog/post.js', (req, res) => {
  res.status(200).sendFile('./scripts/post.js', { root: __dirname },
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

// will run a handler server on 8001 port, so that
// all traffics incoming via port 80 ( which is HTTP port )
// gets redirected into port 443 ( which is HTTPS )
// 
// Any previous link, spread on internet
// need to be handler properly, which is why
// I'm using this HTTP traffic handler server 
http.createServer(http2https).listen(8001, '0.0.0.0',
  () => { console.log('[+]HTTP Server started\n') });

https.createServer(options, app).listen(8000, '0.0.0.0',
  () => { console.log('[+]HTTPS Server started\n') });
