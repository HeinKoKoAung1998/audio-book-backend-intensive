const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

var connection = mysql.createConnection({
    
    host : process.env.HOST,
    user : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    multipleStatements: true 
});

connection.connect((err)=>{
    if(!err)
        console.log('connected')
    else
        console.log(err)
    
});


// const connection = require('./connection');

const createTables = `
CREATE TABLE IF NOT EXISTS Users (
    user_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role ENUM('Admin', 'User') DEFAULT 'User' NOT NULL,
    auth_provider ENUM('X', 'Google', 'Facebook', 'Email') NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME 
);

CREATE TABLE IF NOT EXISTS Books ( 
    book_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(255) NOT NULL, 
    author VARCHAR(255), 
    description TEXT, 
    cover_image_url TEXT 
);

CREATE TABLE IF NOT EXISTS AudioFiles ( 
    audio_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    book_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL, 
    youtube_url TEXT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES Books(book_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Favorites ( 
    favorite_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    user_id BIGINT UNSIGNED NOT NULL,
    audio_id BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (audio_id) REFERENCES AudioFiles(audio_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ListeningHistory ( 
    history_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
    user_id BIGINT UNSIGNED NOT NULL,
    audio_id BIGINT UNSIGNED NOT NULL,
    last_listened_time INT,
    last_update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (audio_id) REFERENCES AudioFiles(audio_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UserActivity (
    active_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Inactive' NOT NULL,
    last_active_time DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);


`;

connection.query(createTables, (err, results) => {
    if (err) {
        console.error('❌ Error Creating Tables:', err);
    } else {
        console.log('✅ Tables Checked/Created Successfully');
    }
    // process.exit();
});


module.exports = connection;
