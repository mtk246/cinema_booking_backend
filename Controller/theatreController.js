const { query } = require("../src/config/pg_connection");
const uuid = require("uuid");
const { response } = require('../utils/response');

exports.get = async (req, res) => {
    const { theatre_id } = req.query;

    let rows = null;

    if (theatre_id) {
        const result = `SELECT
            t.*,
            u.name,
            COALESCE(jsonb_agg(to_jsonb(s.*)), '[]') AS seats
            FROM sch_theatre_management.theatre_tbl t
            LEFT JOIN
                sch_theatre_management.seat_number_tbl s ON s.theatre_id = t.theatre_id
            INNER JOIN
                sch_user_management.user_tbl u ON t.created_by = u.user_id
            WHERE
                s.theatre_id IS NULL AND t.theatre_id=$1
            GROUP BY
                t.theatre_id, t.theatre_name, u.name`;

        rows = await query(result, [theatre_id]);
    } else {
        const result = `SELECT
        t.*,
        u.name,
        COALESCE(jsonb_agg(to_jsonb(s.*)), '[]') AS seats
        FROM sch_theatre_management.theatre_tbl t
        LEFT JOIN
            sch_theatre_management.seat_number_tbl s ON s.theatre_id = t.theatre_id
        INNER JOIN
            sch_user_management.user_tbl u ON t.created_by = u.user_id
        WHERE
            s.theatre_id IS NULL
        GROUP BY
            t.theatre_id, t.theatre_name, u.name`;

        rows = await query(result);
    }

    response(res, rows);
};

exports.createTheatre = async (req, res) => {
    const { theatre_name, created_by } = req.body;

    const id = uuid.v4();

    try {
        await query(
            `INSERT INTO sch_theatre_management.theatre_tbl (theatre_id, theatre_name, created_by, created_at) VALUES ($1, $2, $3, $4)`,
            [
                id,
                theatre_name,
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

exports.updateTheatre = async (req, res) => {
    const { theatre_id, theatre_name, created_by } = req.body;

    try {
        await query(
            `UPDATE sch_theatre_management.theatre_tbl SET theatre_name = $1, created_by = $2, updated_at = $3 WHERE theatre_id = $4`,
            [
                theatre_name,
                created_by,
                new Date(),
                theatre_id,
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
