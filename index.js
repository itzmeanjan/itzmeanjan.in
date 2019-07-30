'use strict';

const express = require('express');
const http = require('http');
const app = express();

app.get('/', (req, res) => {
  console.log(`GET / ${req.ip} ${Date().toString()}`);
  res.status(200).contentType('html').sendFile(
      './pages/index.html', {root : __dirname}, (err) => {
        if (err !== undefined && err !== null)
          res.send('Something went wrong').end();
      });
});

app.get('/blog', (req, res) => {
  console.log(`GET /blog ${req.ip} ${Date().toString()}`);
  res.status(200).contentType('html').sendFile(
      './pages/blog.html', {root : __dirname}, (err) => {
        if (err !== undefined && err !== null)
          res.send('Something went wrong').end();
      });
});

app.get('/contact', (req, res) => {
  console.log(`GET /contact ${req.ip} ${Date().toString()}`);
  res.status(200).contentType('html').sendFile(
      './pages/contact.html', {root : __dirname}, (err) => {
        if (err !== undefined && err !== null)
          res.send('Something went wrong').end();
      });
});

app.get('/data', (req, res) => {
  console.log(`GET /data ${req.ip} ${Date().toString()}`);
  res.status(200).contentType('html').sendFile(
      './pages/data.html', {root : __dirname}, (err) => {
        if (err !== undefined && err !== null)
          res.send('Something went wrong').end();
      });
});

app.get('/projects', (req, res) => {
  console.log(`GET /projects ${req.ip} ${Date().toString()}`);
  res.status(200).contentType('html').sendFile(
      './pages/projects.html', {root : __dirname}, (err) => {
        if (err !== undefined && err !== null)
          res.send('Something went wrong').end();
      });
});

app.get('/index.css', (req, res) => {
  console.log(`GET /index.css ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./styles/index.css', {root : __dirname},
                           (err) => { res.end(); });
});

app.get('/blog.css', (req, res) => {
  console.log(`GET /blog.css ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./styles/blog.css', {root : __dirname},
                           (err) => { res.end(); });
});

app.get('/contact.css', (req, res) => {
  console.log(`GET /contact.css ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./styles/contact.css', {root : __dirname},
                           (err) => { res.end(); });
});

app.get('/data.css', (req, res) => {
  console.log(`GET /data.css ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./styles/data.css', {root : __dirname},
                           (err) => { res.end(); });
});

app.get('/projects.css', (req, res) => {
  console.log(`GET /projects.css ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./styles/projects.css', {root : __dirname},
                           (err) => { res.end(); });
});

app.get('/common.css', (req, res) => {
  console.log(`GET /common.css ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./styles/common.css', {root : __dirname},
                           (err) => { res.end(); });
});

app.get('/myImage.jpg', (req, res) => {
  console.log(`GET /myImage.jpg ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./images/myImage.jpg', {root : __dirname},
                           (err) => { res.end(); });
});

app.get('/myResume.pdf', (req, res) => {
  console.log(`GET /myResume.pdf ${req.ip} ${Date().toString()}`);
  res.status(200).sendFile('./cv/myResume.pdf', {root : __dirname},
                           (err) => { res.end(); });
});

http.createServer(app).listen(8000, '0.0.0.0',
                              () => {console.log('[+]Server started')});
