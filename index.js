'use strict';

const express = require('express');
const http = require('http');
const app = express();

// good to set it, when deploying in production
app.set('env', 'production');

app.get('/', (req, res) => {
  console.log(`GET / ${req.ip} ${Date().toString()}`);
  res.status(200).contentType('html').sendFile(
    './pages/index.html', { root: __dirname }, (err) => {
      if (err !== undefined && err !== null)
        res.send('Something went wrong').end();
    });
});

app.get('/blog', (req, res) => {
  console.log(`GET /blog ${req.ip} ${Date().toString()}`);
  res.status(200).contentType('html').sendFile(
    './pages/blog.html', { root: __dirname }, (err) => {
      if (err !== undefined && err !== null)
        res.send('Something went wrong').end();
    });
});

app.get('/contact', (req, res) => {
  console.log(`GET /contact ${req.ip} ${Date().toString()}`);
  res.status(200).contentType('html').sendFile(
    './pages/contact.html', { root: __dirname }, (err) => {
      if (err !== undefined && err !== null)
        res.send('Something went wrong').end();
    });
});

app.get('/data', (req, res) => {
  console.log(`GET /data ${req.ip} ${Date().toString()}`);
  res.status(200).contentType('html').sendFile(
    './pages/data.html', { root: __dirname }, (err) => {
      if (err !== undefined && err !== null)
        res.send('Something went wrong').end();
    });
});

app.get('/projects', (req, res) => {
  console.log(`GET /projects ${req.ip} ${Date().toString()}`);
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
  console.log(`${req.method} ${req.path} ${req.ip} ${Date().toString()}`);
  res.status(200).contentType('application/json').send(
    {
      ip: req.ip
    }
  ).end();
});

app.get('/blog/post_:id.json', (req, res) => {
  console.log(`GET /blog/post_${req.params.id}.json ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile(`./blog/post_${req.params.id}.json`, { root: __dirname },
    (err) => { res.end(); });
});

app.get('/blog/post_:id', (req, res) => {
  console.log(`GET /blog/post_${req.params.id} ${req.ip} ${Date().toString()}`);
  res.status(200).contentType('html').sendFile(
    './pages/post.html', { root: __dirname }, (err) => {
      if (err !== undefined && err !== null)
        res.send('Something went wrong').end();
    });
});

app.get('(/blog)?/common.css', (req, res) => {
  console.log(`GET ${req.path} ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./styles/common.css', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/blog/post.css', (req, res) => {
  console.log(`GET /blog/post.css ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./styles/post.css', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/myImage.jpg', (req, res) => {
  console.log(`GET /myImage.jpg ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./images/myImage.jpg', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/myResume.pdf', (req, res) => {
  console.log(`GET /myResume.pdf ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./cv/myResume.pdf', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/projects.json', (req, res) => {
  console.log(`GET /projects.json ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./data/projects.json', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/projects.js', (req, res) => {
  console.log(`GET /projects.js ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./scripts/projects.js', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/blog.json', (req, res) => {
  console.log(`GET /blog.json ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./data/blog.json', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/blog.js', (req, res) => {
  console.log(`GET /blog.js ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./scripts/blog.js', { root: __dirname },
    (err) => { res.end(); });
});

app.get('/blog/post.js', (req, res) => {
  console.log(`GET /blog/post.js ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./scripts/post.js', { root: __dirname },
    (err) => { res.end(); });
});

http.createServer(app).listen(8000, '0.0.0.0',
  () => { console.log('[+]Server started\n') });
