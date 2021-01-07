const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'oldtimer',
    port: '3307'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('MySql connected as id ' + connection.threadId);
});

function getAllPatients() {
    const promise = new Promise((resolve, reject) => {
        connection.query('SELECT i.firstname, i.lastname, i.age, p.horlogeid, p.icareid FROM ICARE i LEFT JOIN PATIENT p ON i.id=p.icareid;', (dbErr, dbRes) => {
            if (dbErr) {
                reject(dbErr);
            } else {
                resolve(dbRes);
            }
        });
    })
    return promise;
};

function getPatientById(patientid) {
    const promise = new Promise((resolve, reject) => {
        connection.query(
            'SELECT i.id, i.firstname, i.lastname, i.age, p.horlogeid, h.status, l.id AS locationid, l.time, l.date, l.data FROM ICARE i LEFT JOIN PATIENT p ON i.id=p.icareid LEFT JOIN horloge h ON p.horlogeid=h.id LEFT JOIN LOCATIONREQUEST l ON p.id = l.patient WHERE i.id = ?;',
            patientid,
            (dbErr, dbRes) => {
                if (dbErr) {
                    reject(dbErr);
                } else {
                    resolve(dbRes);
                }
        });
    })
    return promise;
};

function getAllWatches() {
    const promise = new Promise((resolve, reject) => {
        connection.query('SELECT h.id, h.status, p.icareid FROM horloge h LEFT JOIN PATIENT p ON h.id=p.horlogeid;', (dbErr, dbRes) => {
            if (dbErr) {
                reject(dbErr);
            } else {
                resolve(dbRes);
            }
        });
    })
    return promise;
};

function saveLocationReqeust(data) {
    const date_obj = new Date();
    const date = date_obj.getFullYear() + "-" + ("0" + (date_obj.getMonth() + 1)).slice(-2) + "-" + ("0" + date_obj.getDate()).slice(-2);
    const time = date_obj.getHours() + ":" + date_obj.getMinutes();

    const promise = new Promise((resolve, reject) => {
        connection.query('INSERT INTO locationrequest (sender, time, date, patient, data) VALUES (?,?,?,?,?)',
            [1, time, date, 1, data],
            (dbErr, dbRes) => {
            if (dbErr) {
                reject(dbErr);
            } else {
                resolve(dbRes);
            }
        });
    })
    return promise;
};

exports.getAllPatients = getAllPatients;
exports.getPatientById = getPatientById;
exports.getAllWatches = getAllWatches;
exports.saveLocationReqeust = saveLocationReqeust;

//curl -d {"data":"fakedata"} -X POST http://localhost:3000/api
