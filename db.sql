CREATE TABLE user (
    user_idx INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(64) NOT NULL,
    user_email TEXT NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    auth VARCHAR(6) NOT NULL,
    registration_date TIMESTAMP NOT NULL,
    feed INT DEFAULT 0
);

CREATE TABLE post (
    post_idx INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(64) NOT NULL,
    writer VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    contents JSON NOT NULL,
    opinion TEXT,
    post_date TIMESTAMP NOT NULL,
    project_date DATE NOT NULL,
    type VARCHAR(10) NOT NULL,
    tag TEXT NOT NULL,
    like_count INT DEFAULT 0,
    thumbnail LONGTEXT NOT NULL
);

CREATE TABLE post_attach(
    attach_idx INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    post_idx INT NOT NULL,
    path TEXT
);

CREATE TABLE tmp_post_attach(
    tmp_attach_idx INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(64) NOT NULL,
    tmp_path TEXT 
);

CREATE TABLE post_comment(
    comment_idx INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    post_idx INT NOT NULL,
    user_id CHAR(64) NOT NULL,
    writer VARCHAR(50) NOT NULL,
    comment_date TIMESTAMP NOT NULL,
    comment_content TEXT NOT NULL
);

CREATE TABLE comment_reply(
    reply_idx INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    comment_idx INT NOT NULL,
    post_idx INT NOT NULL,
    user_id CHAR(64) NOT NULL,
    writer VARCHAR(50) NOT NULL,
    reply_date TIMESTAMP NOT NULL,
    reply_content TEXT NOT NULL
);

CREATE TABLE post_like(
    like_idx INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    post_idx INT NOT NULL,
    user_id CHAR(64) NOT NULL
);