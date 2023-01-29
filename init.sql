CREATE TABLE IF NOT EXISTS users
(
    id SERIAL NOT NULL PRIMARY KEY,
    phone character varying(20) NOT NULL,
    created_at character varying(50),
    updated_at character varying(50)
);

CREATE TABLE IF NOT EXISTS tokens
(
    id SERIAL NOT NULL PRIMARY KEY,
    user_id integer NOT NULL,
    token text NOT NULL,
    created_at character varying(50) NOT NULL,
    updated_at character varying(50) NOT NULL,
    CONSTRAINT user_fk FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID
);