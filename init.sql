CREATE TABLE IF NOT EXISTS users
(
    id SERIAL NOT NULL PRIMARY KEY,
    phone character varying(20) NOT NULL,
    device_token character varying(255) NOT NULL,
    name character varying(100) NOT NULL,
    minutes integer NOT NULL DEFAULT 180,
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

CREATE TABLE IF NOT EXISTS relationships (
    id SERIAL NOT NULL PRIMARY KEY,
    user1_id integer NOT NULL,
    user2_id integer NOT NULL,
    status smallint NOT NULL,
    created_at character varying(50) NOT NULL,
    updated_at character varying(50) NOT NULL,
    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notes (
    id SERIAL NOT NULL PRIMARY KEY,
    sender_id integer NOT NULL,
    recipient_id integer NOT NULL,
    title character varying(100),
    message text,
    audio_key text,
    date timestamp with time zone NOT NULL,
    is_notified_f boolean NOT NULL DEFAULT false,
    is_notified_s boolean NOT NULL DEFAULT false,
    created_at character varying(50) NOT NULL,
    updated_at character varying(50) NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id)
);