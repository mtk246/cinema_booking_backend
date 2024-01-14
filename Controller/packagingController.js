const { query } = require("../src/config/pg_connection");
const uuid = require("uuid");
const { response } = require('../utils/response');

exports.get = async (req, res) => {
    const { packaging_type_id } = req.query;

    let rows;

    if (packaging_type_id) {
        rows = await query(
            `SELECT
                p.packaging_type_id,
                p.packaging_type_name,
                p.created_at,
                p.updated_at,
                u.user_id,
                u.user_name
            FROM sch_product_management.packaging_type_tbl p
                INNER JOIN sch_user_management.user_tbl u ON p.user_id = u.user_id
            WHERE p.packaging_type_id = $1`,
            [packaging_type_id],``
        );
    } else {
        rows = await query(
            `SELECT 
                p.packaging_type_id,
                p.packaging_type_name,
                p.created_at,
                p.updated_at,
                u.user_id,
                u.user_name
            FROM sch_product_management.packaging_type_tbl p
            INNER JOIN sch_user_management.user_tbl u ON p.user_id = u.user_id`,
        );
    }

    response(res, rows);
}

exports.post = async (req, res) => {
    const { packaging_type_name, user_id } = req.body;

    const obj = {
        packaging_type_id: uuid.v4(),
        packaging_type_name: packaging_type_name,
        user_id: user_id,
        created_at: new Date(),
    };

    await query(
        `INSERT INTO sch_product_management.packaging_type_tbl (packaging_type_id, packaging_type_name, user_id, created_at) VALUES ($1, $2, $3, $4)`,
        [
            obj.packaging_type_id,
            obj.packaging_type_name,
            obj.user_id,
            obj.created_at,
        ]
    );

    response(res, obj);
}

exports.put = async (req, res) => {
    const { packaging_type_id, packaging_type_name, user_id } = req.body;

    const obj = {
        packaging_type_id: packaging_type_id,
        packaging_type_name: packaging_type_name,
        user_id: user_id,
        updated_at: new Date(),
    };

    await query(
        `UPDATE sch_product_management.packaging_type_tbl SET packaging_type_name=$1, user_id=$2, updated_at=$3 WHERE packaging_type_id=$4`,
        [
            obj.packaging_type_name,
            obj.user_id,
            obj.updated_at,
            obj.packaging_type_id,
        ]
    );

    response(res, obj);
}