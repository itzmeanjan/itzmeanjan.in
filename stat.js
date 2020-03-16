'use strict';

/*
  Author: Anjan Roy <anjanroy@yandex.com>
*/

const sqlite = require('sqlite3');

let db;

/**
 * @returns {Promise<boolean>} - performs initial database set up
 */
exports.dbSetUp = () => {
    return new Promise((resolve, reject) => {
        getConnection().then((v) => {
            db = v;
            create().then((v) => {
                close().then((v) => {
                    resolve(v);
                }).catch((e) => {
                    reject(e);
                });
            }).catch((e) => {
                reject(e);
            });
        }).catch((e) => {
            reject(e);
        });
    });
}

/**
 * @returns {Promise<boolean>} - connects to database & initializes `db`, for future database ops
 */
exports.connect = () => {
    return new Promise((resolve, reject) => {
        getConnection().then((v) => {
            db = v;
            resolve(true);
        }).catch((e) => {
            reject(e);
        });
    });
}

/**
 * @param {string} method - Http method
 * @param {string} url - url path accessed by remote
 * @param {string} ip - ip address of remote
 * @param {Date} time - date time of access
 * @returns {Promise<boolean>} - inserts record into database
 */
exports.insert = (method, url, ip, time) => {
    return new Promise((resolve, reject) => {
        db.run(`insert into itzmeanjan_in (method, url, ip, time) values(?, ?, ?, ?);`, [method, url, ip, time.toISOString()], (res, err) => {
            if (err) {
                reject(err);
            }

            resolve(true);
        });
    });
}

/**
 * @returns {Promise<sqlite.Database>} - a connection to database
 */
function getConnection() {
    return new Promise((resolve, reject) => {
        let v = new sqlite.Database("stat.sqlite3", (err) => {
            if (err) {
                reject(err);
            }

            resolve(v);
        });
    });
}

/**
 * @returns {Promise<boolean>} - creates database table
 */
function create() {
    return new Promise((resolve, reject) => {
        db.run(`create table if not exists itzmeanjan_in (id int primary key autoincrement, method text not null, url text not null, ip text not null, time text not null);`, (res, err) => {
            if (err) {
                reject(err);
            }

            resolve(true);
        });
    });
}

/**
 * @returns {Promise<boolean>} -  closes existing database connection
 */
function close() {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) {
                reject(err);
            }

            resolve(true);
        });
    });
}
