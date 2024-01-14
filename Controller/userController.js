const { query } = require("../src/config/pg_connection");
const jwt = require('jsonwebtoken');
const uuid = require("uuid");
const bcrypt = require('bcryptjs');
const { response } = require('../utils/response');

exports.get = async (req, res) => {
    const { user_id } = req.query;

    let rows = null;

    if (user_id) {
        const result = "SELECT * FROM sch_user_management.user_tbl WHERE user_id=$1";

        rows = await query(result, [user_id]);

        delete rows[0]?.user_password;
    } else {
        const result = "SELECT * FROM sch_user_management.user_tbl";

        rows = await query(result);
        delete rows[0]?.user_password;
    }

    response(res, rows);
};

exports.getMe = async (req, res) => {
    const { user_id } = req.query;

    const result = "SELECT * FROM sch_user_management.user_tbl WHERE user_id = $1";

    const rows = await query(result, [user_id]);

    delete rows[0]?.user_password;

    response(res, rows);
}

exports.post = async (req, res) => {
    const { name, user_name, password, role } = req.body;
    console.log(req.body);

    const id = uuid.v4();

    const usernameRegex = /^[a-z0-9]+$/;
    if (!usernameRegex.test(user_name)) {
        return res.status(400).json({
            message: "Invalid user_name. Only lowercase letters and numbers are allowed.",
        });
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                // Handle the error
                return res.status(500).json({
                    status: 500,
                    error: 'Error encrypting password',
                });
            }

            // Create the user account with the generated ID and encrypted password
            const user = {
                id,
                name,
                user_name,
                password: hash,
                role,
            };

            const getQuery = "SELECT * FROM sch_user_management.user_tbl WHERE user_name = $1";

            const results = await query(
                getQuery,
                [user.user_name],
            );

            if (results.length > 0) {
                delete user.password;
                return res.status(400).json({
                    status: 400,
                    message: "User account already exists",
                    data: user,
                });
            }  else {
                const result = "INSERT INTO sch_user_management.user_tbl (user_id, name, user_name, user_password, role, created_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7)";

                await query(
                    result,
                    [
                        user.id,
                        user.name,
                        user.user_name,
                        user.password,
                        user.role,
                        new Date(),
                        true,
                    ],
                );

                const token = jwt.sign({ id: user.id, username: user.user_name }, 'secret_key', { expiresIn: '30d' });

                delete user.password;

                return res.status(200).json({
                    message: "User account created",
                    data: user,
                    token: token,
                });
            }
        });
    });
};

exports.update = async (req, res) => {
    const { user_id, user_name, role, name, status } = req.body;

    const obj = {
        user_id,
        user_name,
        role,
        name,
        status,
    };

    const getUsers = await query(
        `SELECT * FROM sch_user_management.user_tbl WHERE user_id = $1`,
        [obj.user_id],
    )

    if (getUsers.length > 0) {
        // Check if the user_name already exists for a different ID
        const getQuery = await query(
            "SELECT * FROM sch_user_management.user_tbl WHERE user_name = $1 AND user_id != $2",
            [user_name, user_id],
        );

        if (getQuery.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "User name already exists for a different user",
            });
        } else {
            const updateQuery = "UPDATE sch_user_management.user_tbl SET user_name = $1, role = $2, name = $3, updated_at = $4, status = $5 WHERE user_id = $6";

            await query(
                updateQuery,
                [
                    obj.user_name,
                    obj.role,
                    obj.name,
                    new Date,
                    obj.status,
                    obj.user_id,
                ],
            );

            response(res, obj);
        }
    } else {
        return res.status(500).json({
            status: 500,
            message: "There is no user account with this id",
        })
    }
};
