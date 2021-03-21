import mysql from 'mysql-await';

let con;

function connectDB() {
    con = mysql.createConnection(JSON.parse(`{
        "host" : "eu-cdbr-west-03.cleardb.net",
        "user" : "be6d3aa75fd937",
        "password" : "0217487c",
        "database" : "heroku_1b100fc82d59eb9"
    }`));

    con.on('error', (err) => {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Reconnect!')
            connectDB();
        } else {
            console.error(`Connection error ${err.code}`);
        }  
    });
}

function initDB() {
    con.awaitQuery(`CREATE TABLE IF NOT EXISTS users (
        id INT(6) AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(60) NOT NULL UNIQUE
    )`);

    con.awaitQuery(`CREATE TABLE IF NOT EXISTS posts (
        id INT(6),
        postId INT(6) AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(35) NOT NULL UNIQUE,
        subtitle VARCHAR(45) NOT NULL,
        photosPath VARCHAR(255) NOT NULL,
        FOREIGN KEY (id) REFERENCES users(id)
    )`);
    
    endCon();
}

function endCon() {
    con.awaitEnd();
}

function getCon() { return con; }

export { connectDB, getCon, initDB, endCon };