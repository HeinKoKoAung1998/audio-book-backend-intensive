CREATE TABLE Users(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role ENUM('Admin', 'User') DEFAULT 'User' NOT NULL,
    auth_provider ENUM('X', 'Google', 'Facebook', 'Email') NOT NULL
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME 
);

CREATE TABLE Books ( 
      book_id SERIAL PRIMARY KEY, 
      title VARCHAR(255) NOT NULL, 
      author VARCHAR(255), 
      description TEXT, 
      cover_image_url TEXT 
  ); 
 
  CREATE TABLE AudioFiles ( 
      audio_id SERIAL PRIMARY KEY, 
      book_id BIGINT UNSIGNED NOT NULL,
      title VARCHAR(255) NOT NULL, 
      youtube_url TEXT NOT NULL ,
      FOREIGN KEY (book_id) REFERENCES Books(book_id) ON DELETE CASCADE
  ); 
 
  CREATE TABLE Favorites ( 
      favorite_id SERIAL PRIMARY KEY, 
      user_id BIGINT UNSIGNED NOT NULL,
      audio_id BIGINT UNSIGNED NOT NULL
  ); 
 
  CREATE TABLE ListeningHistory ( 
      history_id SERIAL PRIMARY KEY, 
      user_id BIGINT UNSIGNED NOT NULL,
      audio_id BIGINT UNSIGNED NOT NULL,
      last_listened_time INT 
  ); 

  CREATE TABLE UserActivity (
    active_id SERIAL PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Inactive' NOT NULL,
    last_active_time DATETIME NOT NULL
);
 
ALTER TABLE AudioFiles ADD FOREIGN KEY (book_id) REFERENCES Books(book_id) ON DELETE CASCADE; 

ALTER TABLE Favorites ADD FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
ALTER TABLE Favorites add FOREIGN KEY (audio_id) REFERENCES AudioFiles(audio_id) ON DELETE CASCADE;

ALTER TABLE ListeningHistory ADD FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;
ALTER TABLE ListeningHistory ADD FOREIGN KEY (audio_id) REFERENCES AudioFiles(audio_id) ON DELETE CASCADE;

ALTER TABLE UserActivity ADD FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE;

ALTER TABLE ListeningHistory ADD COLUMN last_update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;const db = require('./db'); // Import the database connection
