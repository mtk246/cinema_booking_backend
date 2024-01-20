-- CREATE Schemas

CREATE SCHEMA IF NOT EXISTS public
    AUTHORIZATION cinema;

CREATE SCHEMA IF NOT EXISTS sch_user_management
    AUTHORIZATION cinema;

CREATE SCHEMA IF NOT EXISTS sch_movie_management
    AUTHORIZATION cinema;

CREATE SCHEMA IF NOT EXISTS sch_movie_ticket_management
    AUTHORIZATION cinema;

CREATE SCHEMA IF NOT EXISTS sch_movie_booking_management
    AUTHORIZATION cinema;

CREATE SCHEMA IF NOT EXISTS sch_theatre_management
    AUTHORIZATION cinema;

---

CREATE TABLE IF NOT EXISTS

sch_movie_management.movie_tbl (
    movie_id text COLLATE pg_catalog."default" NOT NULL,
    theatre_id text COLLATE pg_catalog."default" NOT NULL,
    movie_name text COLLATE pg_catalog."default",
    status boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    created_by text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT movie_tbl_pkey PRIMARY KEY (movie_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_movie_management."movie_tbl"
    OWNER to cinema;

-- ---

-- ---

CREATE TABLE IF NOT EXISTS

sch_movie_management.movie_time_tbl (
    movie_time_id text COLLATE pg_catalog."default" NOT NULL,
    movie_id text COLLATE pg_catalog."default" NOT NULL,
    theatre_id text COLLATE pg_catalog."default" NOT NULL,
    start_time character varying(10) COLLATE pg_catalog."default" NOT NULL,
    end_time character varying(10) COLLATE pg_catalog."default" NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    created_by text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT movie_time_tbl_pkey PRIMARY KEY (movie_time_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_movie_management."movie_time_tbl"
    OWNER to cinema;
---

-- ---
CREATE TABLE IF NOT EXISTS

sch_movie_management.movie_detail_tbl (
    movie_detail_id text COLLATE pg_catalog."default" NOT NULL,
    movie_id text COLLATE pg_catalog."default" NOT NULL,
    movie_description text COLLATE pg_catalog."default",
    movie_team_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    created_by text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT movie_detail_tbl_pkey PRIMARY KEY (movie_detail_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_movie_management."movie_detail_tbl"
    OWNER to cinema;
-- ---

-- ---
CREATE TABLE IF NOT EXISTS

sch_movie_management.movie_team_tbl (
    movie_team_id text COLLATE pg_catalog."default" NOT NULL,
    movie_id text COLLATE pg_catalog."default" NOT NULL,
    member_name text COLLATE pg_catalog."default",
    member_role text COLLATE pg_catalog."default",
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    created_by text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT movie_team_tbl_pkey PRIMARY KEY (movie_team_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_movie_management."movie_team_tbl"
    OWNER to cinema;
---

CREATE TABLE IF NOT EXISTS

sch_movie_management.movie_genre_tbl (
    movie_genre_id text COLLATE pg_catalog."default" NOT NULL,
    movie_id text COLLATE pg_catalog."default" NOT NULL,
    genre_name text COLLATE pg_catalog."default" NOT NULL,
    status boolean,
    created_by text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT movie_genre_tbl_pkey PRIMARY KEY (movie_genre_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_movie_management."movie_genre_tbl"
    OWNER to cinema;
-- ---

-- ---
CREATE TABLE IF NOT EXISTS

sch_movie_ticket_management.movie_ticket_tbl (
    ticket_id text COLLATE pg_catalog."default" NOT NULL,
    movie_id text COLLATE pg_catalog."default",
    price double precision,
    created_by text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    ticket_last_number text COLLATE pg_catalog."default",
    CONSTRAINT movie_ticket_tbl_pkey PRIMARY KEY (ticket_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_movie_ticket_management."movie_ticket_tbl"
    OWNER to cinema;
-- ---
---
CREATE TABLE IF NOT EXISTS

sch_movie_booking_management.booking_tbl (
    booking_id text COLLATE pg_catalog."default" NOT NULL,
    movie_id text COLLATE pg_catalog."default" NOT NULL,
    ticket_id text COLLATE pg_catalog."default" NOT NULL,
    booked_by text COLLATE pg_catalog."default" NOT NULL,
    seat_number_id text COLLATE pg_catalog."default" NOT NULL,
    booking_last_number text COLLATE pg_catalog."default",
    theatre_id text COLLATE pg_catalog."default" NOT NULL,
    quantity integer,
    total_amount double precision,
    note text COLLATE pg_catalog."default",
    discount double precision,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT booking_tbl_pkey PRIMARY KEY (booking_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_movie_booking_management."booking_tbl"
    OWNER to cinema;

---

CREATE TABLE IF NOT EXISTS

sch_theatre_management.theatre_tbl (
    theatre_id text COLLATE pg_catalog."default" NOT NULL,
    theatre_name text COLLATE pg_catalog."default" NOT NULL,
    status boolean DEFAULT true,
    created_by text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT theatre_tbl_pkey PRIMARY KEY (theatre_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_theatre_management."theatre_tbl"
    OWNER to cinema;
-- ---

---

CREATE TABLE IF NOT EXISTS

sch_theatre_management.seat_number_tbl (
    seat_number_id text COLLATE pg_catalog."default" NOT NULL,
    seat_name text COLLATE pg_catalog."default" NOT NULL,
    seat_price double precision,
    theatre_id text COLLATE pg_catalog."default" NOT NULL,
    created_by text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT seat_number_tbl_pkey PRIMARY KEY (seat_number_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_theatre_management."seat_number_tbl"
    OWNER to cinema;
-- ---

---
CREATE TABLE IF NOT EXISTS

sch_user_management.user_tbl (
    user_id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default",
    user_name text COLLATE pg_catalog."default",
    user_password text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    phone_number text COLLATE pg_catalog."default",
    status boolean,
    role integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT user_tbl_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS sch_user_management."user_tbl"
    OWNER to cinema;
---
