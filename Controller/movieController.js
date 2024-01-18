const { query } = require("../src/config/pg_connection");
const uuid = require("uuid");
const { response } = require('../utils/response');

exports.get = async (req, res) => {
    const { movie_id } = req.query;

    let rows = null;

    if (movie_id) {
        const result = `SELECT
            m.movie_id, m.movie_name, m.created_at, m.updated_at, u.user_id, u.name
            FROM sch_movie_management.movie_tbl m
            INNER JOIN sch_user_management.user_tbl u ON m.created_by = u.user_id
            WHERE movie_id=$1`;

        rows = await query(result, [movie_id]);
    } else {
        const result = `SELECT * FROM sch_movie_management.movie_tbl m
        INNER JOIN sch_user_management.user_tbl u ON m.created_by = u.user_id`;

        rows = await query(result);
    }

    response(res, rows);
};

exports.post = async (req, res) => {
    const { movie_name, created_by } = req.body;

    const id = uuid.v4();

    try {
        await query(
            `INSERT INTO sch_movie_management.movie_tbl (movie_id, movie_name, created_by, created_at) VALUES ($1, $2, $3, $4)`,
            [
                id,
                movie_name,
                created_by,
                new Date(),
            ]
        );

        response(res, req.body);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            error: "Something went wrong. Please try again.",
        })
    }
}

exports.put = async (req, res) => {
    const { movie_id, movie_name, created_by } = req.body;

    try {
        await query(
            `UPDATE sch_movie_management.movie_tbl SET movie_name = $1, created_by = $2, updated_at = $3 WHERE movie_id = $4`,
            [
                movie_name,
                created_by,
                new Date(),
                movie_id,
            ]
        );

        response(res, req.body);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            error: "Something went wrong. Please try again.",
        })
    }
}

exports.getSchedules = async (req, res) => {
    const { movie_schedule_id } = req.query;

    let rows = null;

    if (movie_schedule_id) {
        const result = `SELECT
            t.*,
            m.movie_id, m.movie_name, m.updated_at, u.user_id, u.name
            FROM sch_movie_management.movie_time_tbl t
            INNER JOIN sch_user_management.user_tbl u ON t.created_by = u.user_id
            INNER JOIN sch_movie_management.movie_tbl m ON t.movie_id = m.movie_id
            WHERE t.movie_id=$1`;

        rows = await query(result, [movie_schedule_id]);
    } else {
        const result = `SELECT
        t.*,
        m.movie_id, m.movie_name, m.updated_at, u.user_id, u.name
        FROM sch_movie_management.movie_time_tbl t
        INNER JOIN sch_user_management.user_tbl u ON t.created_by = u.user_id
        INNER JOIN sch_movie_management.movie_tbl m ON t.movie_id = m.movie_id`;

        rows = await query(result);
    }

    response(res, rows);
};

exports.createSchedule = async (req, res) => {
    const { movie_id, start_time, end_time, created_by, start_date, end_date } = req.body;

    const id = uuid.v4();

    try {
        await query(
            `INSERT INTO sch_movie_management.movie_time_tbl (movie_time_id, movie_id, start_time, end_time, created_by, created_at, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                id,
                movie_id,
                start_time,
                end_time,
                created_by,
                new Date(),
                start_date,
                end_date,
            ]
        );

        response(res, req.body);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            error: "Something went wrong. Please try again.",
        })
    }
}
