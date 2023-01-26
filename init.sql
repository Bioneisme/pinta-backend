CREATE TABLE IF NOT EXISTS users
(
    id SERIAL NOT NULL PRIMARY KEY,
    phone character varying(100) NOT NULL,
    created_at character varying(50),
    updated_at character varying(50)
);