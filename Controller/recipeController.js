const { query } = require("../src/config/pg_connection");
const uuid = require("uuid");
const { response } = require('../utils/response');

exports.get = async (req, res) => {
    const { recipe_group_id } = req.query;

    let rows = null;

    if (recipe_group_id) {
        rows = await query(
            `SELECT
                r.recipe_group_id,
                r.recipe_group_name,
                r.user_id,
                r.created_at,
                r.updated_at,
                u.user_name
            FROM sch_product_management.recipe_group r
                INNER JOIN sch_user_management.user_tbl u ON u.user_id = r.user_id
            WHERE r.recipe_group_id = $1`,
            [recipe_group_id],
        )
    } else {
        rows = await query(
            `SELECT
                r.recipe_group_id,
                r.recipe_group_name,
                r.user_id,
                r.created_at,
                r.updated_at,
                u.user_name
            FROM sch_product_management.recipe_group r
                INNER JOIN sch_user_management.user_tbl u ON u.user_id = r.user_id`
        )
    }

    response(res, rows);
};

exports.recipeDetail = async (req, res) => {
    const { recipe_group_id } = req.query;

    let rows = null;

    if (recipe_group_id) {
        rows = await query(
            `SELECT
                r.recipe_group_id,
                r.recipe_group_name,
                r.user_id,
                r.created_at,
                r.original_price,
                r.sell_price as product_sell_price,
                i.recipe_item_id,
                i.product_id,
                i.status as recipe_item_status,
                pt.packaging_type_id,
                pt.packaging_type_name,
                p.product_name
            FROM sch_product_management.recipe_group r
                INNER JOIN sch_product_management.recipe_item i ON i.recipe_group_id = r.recipe_group_id
                INNER JOIN sch_product_management.product_tbl p ON p.product_id = i.product_id
                INNER JOIN sch_product_management.packaging_type_tbl pt ON pt.packaging_type_id = p.packaging_type_id
            WHERE r.recipe_group_id = $1
            `,
            [recipe_group_id],
        );

        for (const row of rows) {
            const productionId = row.production_id;

            if (productionId) {
                const getProductionDetail = await query(
                    `SELECT * FROM sch_production_management.production_tbl WHERE production_id = $1`,
                    [productionId],
                );

                row.production = getProductionDetail;
            } else {
                row.production = [];
            }
        }

        const recipeGroup = await query(
            `SELECT * FROM sch_product_management.recipe_group r
            WHERE r.recipe_group_id = $1`,
            [recipe_group_id],
        );

        const combinedArr = [
            [...rows],
            [{ recipeGroup: recipeGroup }],
        ];

        response(res, combinedArr);
    } else {
        rows = await query(
            `SELECT
            r.recipe_group_id,
            r.recipe_group_name,
            r.user_id,
            r.created_at,
            r.original_price,
            r.sell_price as product_sell_price,
            i.recipe_item_id,
            i.product_id,
            i.status as recipe_item_status,
            s.quantity,
            s.weight,
            s.is_weight,
            pt.packaging_type_id,
            pt.packaging_type_name,
            p.product_name
        FROM sch_product_management.recipe_group r
            INNER JOIN sch_product_management.recipe_item i ON i.recipe_group_id = r.recipe_group_id
            INNER JOIN sch_product_management.stocklist_history_tbl s ON s.product_id = i.product_id
            INNER JOIN sch_product_management.packaging_type_tbl pt ON pt.packaging_type_id = s.packaging_type_id
            INNER JOIN sch_product_management.product_tbl p ON p.product_id = s.product_id
        `
        )

        response(res, rows);
    }
}

exports.post = async (req, res) => {
    const {
        recipe_group_id,
        recipe_name,
        ingredients,
        user_id
    } = req.body;

    const obj = {
        recipe_group_name: recipe_name,
        ingredients: ingredients,
        user_id: user_id,
        recipe_group_id: recipe_group_id !== "" ? recipe_group_id : uuid.v4(),
        created_at: new Date(),
    };

    if (obj.ingredients.length > 0) {
        if (recipe_group_id === "") {
            // recipe_group
            await query(
                `INSERT INTO sch_product_management.recipe_group (recipe_group_id, recipe_group_name, user_id, created_at) VALUES ($1, $2, $3, $4)`,
                [
                    obj.recipe_group_id,
                    obj.recipe_group_name,
                    obj.user_id,
                    obj.created_at,
                ],
            );

            obj.ingredients.forEach(async (item) => {
                const recipe_item_id = uuid.v4();

                // recipe_item
                await query(
                    `INSERT INTO sch_product_management.recipe_item (recipe_item_id, product_id, recipe_group_id, status, user_id, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        recipe_item_id,
                        item.value,
                        obj.recipe_group_id,
                        true,
                        obj.user_id,
                        obj.created_at,
                    ]
                )
            });
        } else {
            obj.ingredients.forEach(async (item) => {
                const recipe_item_id = uuid.v4();

                // recipe_item
                await query(
                    `INSERT INTO sch_product_management.recipe_item (recipe_item_id, product_id, recipe_group_id, status, user_id, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        recipe_item_id,
                        item.value,
                        obj.recipe_group_id,
                        true,
                        obj.user_id,
                        obj.created_at,
                    ]
                )
            });
        }

        response(res, obj);
    } else {
        return res.status(400).json({
            "message": "There is no ingredients",
        })
    }
}

exports.put = async (req, res) => {
    const {recipe_item_id, status} = req.body;

    if (recipe_item_id) {
        await query(
            `UPDATE sch_product_management.recipe_item SET status=$1 WHERE recipe_item_id = $2`,
            [status,recipe_item_id],
        );
    } else {
        return res.status(400).json({
            "message": "Error updating recipe item",
        })
    }

    response(res, req.body);
}

exports.price = async (req, res) => {
    const {original_price, recipe_group_id} = req.body;

    await query(
        `UPDATE sch_product_management.recipe_group SET original_price=$1 WHERE recipe_group_id = $2`,
        [original_price, recipe_group_id],
    );

    response(res, req.body);
}