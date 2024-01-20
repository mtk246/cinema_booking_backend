const { query } = require("../src/config/pg_connection");
const uuid = require("uuid");
const { response } = require('../utils/response');

exports.createBooking = async (req, res) => {
    const {
        movie_id,
        seat_number_id,
        theatre_id,
        user_name,
        user_email,
        user_phone,
        price,
    } = req.body;

    const ticket_id = uuid.v4();
    const user_id = uuid.v4();
    const booking_id = uuid.v4();

    try {
        // User Tbl
        await query(
            `INSERT INTO sch_user_management.user_tbl (user_id, name, user_name, user_password, email, phone_number, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                user_id,
                user_name,
                user_name.toLowerCase().replace(/\s/g, ''),
                'password',
                user_email,
                user_phone,
                1,
                new Date(),
            ]
        );

        // Ticket Tbl
        await query(
            `INSERT INTO sch_movie_ticket_management.movie_ticket_tbl (ticket_id, movie_id, price, created_by, created_at, ticket_last_number) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                ticket_id,
                movie_id,
                price,
                user_id,
                new Date(),
                ticket_id.slice(-6),
            ]
        );

        // Booking Tbl
        await query(
            `INSERT INTO sch_movie_booking_management.booking_tbl (booking_id, movie_id, ticket_id, booked_by, seat_number_id, booking_last_number, theatre_id, quantity, total_amount, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                booking_id,
                movie_id,
                ticket_id,
                user_id,
                seat_number_id,
                booking_id.slice(-6),
                theatre_id,
                1,
                price,
                new Date(),
            ]
        );

        return res.status(200).json({
            status: 200,
            message: "Booking created successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            error: "Something went wrong. Please try again.",
        })
    }
}

exports.searchBooking = async (req, res) => {
    const { name, email, booking_last_number } = req.body;

    const result = `SELECT
        u.name,
        u.user_name,
        u.email,
        u.phone_number,
        t.ticket_id,
        t.movie_id,
        t.price,
        t.ticket_last_number,
        b.booking_id,
        b.seat_number_id,
        b.theatre_id,
        b.quantity,
        b.total_amount,
        m.movie_name,
        b.booking_last_number,
        s.seat_name,
        m.movie_name
    FROM sch_user_management.user_tbl u
    INNER JOIN sch_movie_ticket_management.movie_ticket_tbl t ON t.created_by = u.user_id
    INNER JOIN sch_movie_booking_management.booking_tbl b ON t.ticket_id = b.ticket_id
    INNER JOIN sch_movie_management.movie_tbl m ON b.movie_id = m.movie_id
    INNER JOIN sch_theatre_management.seat_number_tbl s ON s.seat_number_id = b.seat_number_id
    INNER JOIN sch_movie_management.movie_time_tbl mt ON mt.movie_id = b.movie_id
    WHERE u.name LIKE '%${name}%' AND u.email LIKE '%${email}%' AND b.booking_last_number LIKE '%${booking_last_number}%'`;

    const rows = await query(result);

    response(res, rows);
}
