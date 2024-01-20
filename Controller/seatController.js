const { query } = require("../src/config/pg_connection");
const uuid = require("uuid");
const { response } = require('../utils/response');

exports.createSeat = async (req, res) => {
    const { theatre_id, seat_name, created_by, seat_price } = req.body;

    const seat_number_id = uuid.v4();

    try {
        await query(
            `INSERT INTO sch_theatre_management.seat_number_tbl (seat_number_id, seat_name, theatre_id, created_by, created_at, seat_price) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                seat_number_id,
                seat_name,
                theatre_id,
                created_by,
                new Date(),
                seat_price
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
