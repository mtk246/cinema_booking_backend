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
    movie_name text COLLATE pg_catalog."default",
    status boolean,
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
    start_time timestamp with time zone,
    end_time timestamp with time zone,
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

-- CREATE TABLE IF NOT EXISTS

-- sch_theatre_management.seat_number_tbl (
--     seat_number_id text COLLATE pg_catalog."default" NOT NULL,
--     seat_name text COLLATE pg_catalog."default" NOT NULL,
--     theatre_id text COLLATE pg_catalog."default" NOT NULL,
--     created_by text COLLATE pg_catalog."default" NOT NULL,
--     created_at timestamp with time zone,
--     updated_at timestamp with time zone,
--     CONSTRAINT seat_number_tbl_pkey PRIMARY KEY (seat_number_id)
-- )

-- TABLESPACE pg_default;

-- ALTER TABLE IF EXISTS sch_theatre_management."seat_number_tbl"
--     OWNER to cinema;
-- -- ---

---
CREATE TABLE IF NOT EXISTS

sch_user_management.user_tbl (
    user_id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default",
    user_name text COLLATE pg_catalog."default",
    user_password text COLLATE pg_catalog."default",
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

---
-- CREATE SEQUENCE IF NOT EXISTS purchase_voucher_id_seq START 1000;

-- CREATE TABLE IF NOT EXISTS

-- sch_voucher_management.purchase_voucher_tbl (
--     purchase_voucher_id text DEFAULT CONCAT(nextval('purchase_voucher_id_seq'), '-PC') NOT NULL,
--     purchase_id text COLLATE pg_catalog."default",
--     created_at timestamp with time zone,
--     updated_at timestamp with time zone,
--     CONSTRAINT purchase_voucher_tbl_pkey PRIMARY KEY (purchase_voucher_id)
-- )

-- TABLESPACE pg_default;

-- ALTER TABLE IF EXISTS sch_user_management."user_tbl"
--     OWNER to cinema;
---
---
-- CREATE TABLE IF NOT EXISTS

-- sch_production_management.production_tbl (
--     production_id text COLLATE pg_catalog."default" NOT NULL,
--     recipe_group_id text COLLATE pg_catalog."default",
--     recipe_item_id text COLLATE pg_catalog."default",
--     actual_weight double precision,
--     actual_quantity double precision,
--     is_weight boolean,
--     user_id text COLLATE pg_catalog."default",
--     created_at timestamp with time zone,
--     updated_at timestamp with time zone,
--     CONSTRAINT production_tbl_pkey PRIMARY KEY (production_id)
-- )

-- TABLESPACE pg_default;

-- ALTER TABLE IF EXISTS sch_user_management."production_tbl"
--     OWNER to cinema;
-- ---
-- ---
-- CREATE TABLE IF NOT EXISTS

-- sch_production_management.production_history_tbl (
--     production_history_id text COLLATE pg_catalog."default" NOT NULL,
--     recipe_group_id text COLLATE pg_catalog."default",
--     recipe_item_id text COLLATE pg_catalog."default",
--     production_id text COLLATE pg_catalog."default",
--     created_at timestamp with time zone,
--     updated_at timestamp with time zone,
--     unit_qty double precision,
--     total_qty double precision,
--     CONSTRAINT production_history_tbl_pkey PRIMARY KEY (production_history_id)
-- )

-- TABLESPACE pg_default;

-- ALTER TABLE IF EXISTS sch_user_management."production_history_tbl"
--     OWNER to cinema;
-- ---
