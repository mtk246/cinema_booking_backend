const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { query } = require("../src/config/pg_connection");

exports.login = async (req, res) => {
    const { user_name, password } = req.body;

    const result = "SELECT * FROM sch_user_management.user_tbl WHERE user_name = $1";

    const results = await query(
        result,
        [user_name],
    );

    if (results.length > 0) {
        const user = {
            id: results[0].user_id,
            username: results[0].user_name,
            password: results[0].user_password,
            role: results[0].role
        };

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    error: 'Error comparing passwords',
                });
            }

            if (result) {
                console.log(user.id, user.username);
                const token = jwt.sign({ id: user.id, username: user.username }, 'secret_key', { expiresIn: '30d' });

                delete user.password;

                return res.status(200).json({
                    message: 'Login successful',
                    token: token,
                    result: user,
                });
            } else {
                return res.status(401).json({
                    status: 401,
                    error: 'Authentication failed',
                });
            }
        });
    } else {
        return res.status(400).json({
            message: "Invalid User Account",
        })
    }
};
