CREATE DATABASE database_links;

USE database_links;

CREATE TABLE users(
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users ADD PRIMARY KEY (id);

/* ALTER TABLE users
    ADD PRIMARY KEY (id)
*/
/* ALTER TABLE users 
    ADD (id) INT(11) NOT NULL auto_increment = 2; */


/* DESCRIBE users; */

-- Links tables
CREATE TABLE links (
    id INT(11) NOT NULL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description text,
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    constraint fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

/* ALTER TABLE links 
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2; */

/* Insert */
INSERT INTO links values (4, 'Nacho 4', 'http://nachoweb.com', 'Prueba desde consola', NULL, NULL);