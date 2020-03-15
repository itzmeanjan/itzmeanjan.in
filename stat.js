'use strict';

const sqlite = require('sqlite3');

let db = new sqlite.Database("./stat.db", (err) => {
    return err ? console.error(`${err.name} - ${err.message}`) : console.log("connected");
}); // connecting to database


/**
 * creates an in-disk database with hardcoded table name
 * which is to be used for site logging purpose
 */
exports.create = function () {
    db.run(`create table itzmeanjan_in if not exists (id int primary key autoincrement, method text not null, url text not null, ip text not null, time text not null)`, (res, err) => {
        if (err) {
            return console.error(`${err.name} - ${err.message}`);
        }
        console.log("created");
    });
}

/**
 * @param {string} method - Http method
 * @param {string} url - url path accessed by remote
 * @param {string} ip - ip address of remote
 * @param {Date} time - date time of access
 */
exports.insert = function (method, url, ip, time) {
    db.run(`insert into itzmeanjan_in (method, url, ip, time) values(?, ?, ?, ?)`, [method, url, ip, time.toISOString()], (res, err) => {
        if (err) {
            return console.error(`${err.name} - ${err.message}`);
        }
        console.log("inserted");
    });
}

/**
 * closes existing database connection
 */
exports.close = function () {
    db.close((err) => {
        return err ? console.error(`${err.name} - ${err.message}`) : console.log("closed");
    });
}
