const { query } = require("../src/config/pg_connection");
const uuid = require("uuid");
const { response } = require('../utils/response');
const moment = require('moment');
require('moment-timezone');

exports.productionDetail = async (req, res) => {
    const { recipe_group_id, start_date } = req.query;

    let formattedDate;

    if (start_date !== "today" && start_date !== "yesterday") {
        const inputDate = moment.tz(start_date, 'YYYY-MM-DD HH:mm:ss.SSS', 'UTC');
        formattedDate = inputDate.tz('Asia/Yangon').format('YYYY-MM-DD');
    }

    let rows = null;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);

    const today = new Date(currentDate);
    today.setDate(today.getDate() + 1);

    try {
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
                    p.product_name,
                    s.quantity,
                    s.weight,
                    s.is_weight,
                    s.unit_price as buy_price,
                    s.stocklist_history_id,
                    pt.packaging_type_id,
                    pt.packaging_type_name
                FROM sch_product_management.recipe_group r
                    INNER JOIN sch_product_management.recipe_item i ON i.recipe_group_id = r.recipe_group_id
                    INNER JOIN sch_product_management.stocklist_history_tbl s ON s.product_id = i.product_id
                    INNER JOIN sch_product_management.packaging_type_tbl pt ON pt.packaging_type_id = s.packaging_type_id
                    INNER JOIN sch_product_management.product_tbl p ON p.product_id = s.product_id
                WHERE r.recipe_group_id = $1  AND i.status=true`,
                [recipe_group_id],
            );

            for (const row of rows) {
                let history = `SELECT * FROM sch_production_management.production_history_tbl WHERE recipe_group_id = $1 AND recipe_item_id = $2`;

                if (start_date !== "today" && start_date !== "yesterday") {
                    history += ` AND DATE_TRUNC('day', created_at) = $3`;
                } else if (start_date === 'today') {
                    history += ` AND created_at >= $3 AND created_at < $4`;
                } else if (start_date === 'yesterday') {
                    history += ` AND created_at >= $3 AND created_at < $4`;
                }

                let productionHistoryParams = [];

                if (start_date !== "today" && start_date !== "yesterday") {
                    productionHistoryParams = [recipe_group_id, row.recipe_item_id, formattedDate];
                } else if (start_date === 'today') {
                    productionHistoryParams = [recipe_group_id, row.recipe_item_id, currentDate, today];
                } else if (start_date === 'yesterday') {
                    productionHistoryParams = [recipe_group_id, row.recipe_item_id, yesterday, currentDate];
                }

                const productionHistory = await query(history, productionHistoryParams);

                if (productionHistory.length > 0) {
                    const productionId = productionHistory[0]?.production_id;
                    if (productionId) {
                        let getProductionDetail = `SELECT * FROM sch_production_management.production_tbl WHERE production_id = $1 AND recipe_item_id = $2`;

                        if (start_date !== "today" && start_date !== "yesterday") {
                            getProductionDetail += ` AND DATE_TRUNC('day', created_at) = $3`;
                        } else if (start_date === 'today') {
                            getProductionDetail += ` AND created_at >= $3 AND created_at < $4`;
                        } else if (start_date === 'yesterday') {
                            getProductionDetail += ` AND created_at >= $3 AND created_at < $4`;
                        }

                        let queryParams = [];

                        if (start_date !== "today" && start_date !== "yesterday") {
                            queryParams = [productionId, row.recipe_item_id, formattedDate];
                        } else if (start_date === 'today') {
                            queryParams = [productionId, row.recipe_item_id, currentDate, today];
                        } else if (start_date === 'yesterday') {
                            queryParams = [productionId, row.recipe_item_id, yesterday, currentDate];
                        }

                        const productionRows = await query(getProductionDetail, queryParams);

                        row.production = productionRows;
                        row.productionId = productionHistory;
                    } else {
                        row.production = [];
                        row.productionId = productionHistory;
                    }
                } else {
                    row.production = [];
                    row.productionId = productionHistory;
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

            res.json(combinedArr);
        } else {
            rows = await query(
                `SELECT
                r.recipe_group_id,
                r.recipe_group_name,
                r.user_id,
                r.created_at,
                i.recipe_item_id,
                i.product_id,
                i.status as recipe_item_status,
                p.product_name,
                s.quantity,
                s.unit_price as buy_price,
                s.stocklist_history_id,
                s.weight,
                s.is_weight
            FROM sch_product_management.recipe_group r
                INNER JOIN sch_product_management.recipe_item i ON i.recipe_group_id = r.recipe_group_id
                INNER JOIN sch_product_management.stocklist_history_tbl s ON s.product_id = i.product_id
                INNER JOIN sch_product_management.product_tbl p ON p.product_id = s.product_id`
            );

            res.json(rows);
        }
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "An internal server error occurred." });
    }
};

async function abstractFromProductTable(productId, isWeight, remainingAmount) {
    const getOneProduct = await query(
        `SELECT * FROM sch_product_management.stocklist_history_tbl WHERE product_id = $1`,
        [productId]
    );

    if (getOneProduct.length > 0) {
        let newWeight = getOneProduct[0].weight;
        let newQuantity = getOneProduct[0].quantity;

        if (isWeight) {
            newWeight -= remainingAmount;
        } else {
            newQuantity -= remainingAmount;
        }

        await query(
        `UPDATE sch_product_management.stocklist_history_tbl SET weight = $1, quantity = $2 WHERE product_id = $3`,
        [newWeight, newQuantity, productId]
        );
    }
}

exports.post = async (req, res) => {
    const {
        recipe_item_id,
        actual_weight,
        actual_quantity,
        is_weight,
        user_id,
        production_id,
        product_id,
        recipe_group_id,
        stock_list_history_id,
    } = req.body;

    const obj = {
        recipe_item_id: recipe_item_id,
        actual_weight: actual_weight,
        actual_quantity: actual_quantity,
        is_weight: is_weight,
        user_id: user_id,
        production_id: production_id,
        product_id: product_id,
        created_at: new Date(),
        recipe_group_id: recipe_group_id,
        stocklist_history_id: stock_list_history_id,
    };

    if (obj.production_id === "") {
        const production_id = uuid.v4();
        const production_history_id = uuid.v4();

        const getRelatedProductDetails = await query(
            `SELECT
                *
            FROM sch_product_management.stocklist_history_tbl p
            WHERE p.product_id = $1
            ORDER BY p.created_at ASC
            `,
            [obj.product_id]
        );

        let remainingAmount = obj.is_weight ? obj.actual_weight : obj.actual_quantity;

        for (const record of getRelatedProductDetails) {
            if (remainingAmount > 0) {
                const deductedAmount = Math.min(
                    obj.is_weight ? record.weight : record.quantity,
                    remainingAmount
                );
            
                remainingAmount -= deductedAmount;

                if (obj.is_weight) {
                    record.weight -= deductedAmount;
                } else {
                    record.quantity -= deductedAmount;
                }

                await query(
                    `UPDATE sch_product_management.stocklist_history_tbl SET weight = $1, quantity = $2 WHERE stocklist_history_id = $3`,
                    [record.weight, record.quantity, record.stocklist_history_id]
                );
            }
        }

        if (remainingAmount > 0) {
            const anotherRecord = getRelatedProductDetails.find(record => record.stocklist_history_id !== obj.stocklist_history_id);
          
            if (anotherRecord) {
                const deductedAmount = Math.min(
                    obj.is_weight ? anotherRecord.weight : anotherRecord.quantity,
                    remainingAmount
                );
            
                remainingAmount -= deductedAmount;

                if (obj.is_weight) {
                    anotherRecord.weight -= deductedAmount;
                } else {
                    anotherRecord.quantity -= deductedAmount;
                }
            
                await query(
                    `UPDATE sch_product_management.stocklist_history_tbl SET weight = $1, quantity = $2 WHERE stocklist_history_id = $3`,
                    [anotherRecord.weight, anotherRecord.quantity, anotherRecord.stocklist_history_id]
                );
            }
        }
        if (remainingAmount > 0) {
            await abstractFromProductTable(obj.product_id, obj.is_weight, remainingAmount);
        }

        await query(
            `INSERT INTO sch_production_management.production_history_tbl (production_history_id, recipe_group_id, recipe_item_id, production_id, created_at) VALUES ($1, $2, $3, $4, $5)`,
            [production_history_id, obj.recipe_group_id, obj.recipe_item_id, production_id, obj.created_at]
        );

        await query(
            `INSERT INTO sch_production_management.production_tbl (production_id, recipe_group_id, recipe_item_id, actual_weight, actual_quantity, is_weight, user_id, created_at, product_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                production_id,
                obj.recipe_group_id,
                obj.recipe_item_id,
                obj.is_weight ? obj.actual_weight : 0,
                !obj.is_weight ? obj.actual_quantity : 0,
                obj.is_weight,
                obj.user_id,
                obj.created_at,
                obj.product_id,
            ]
        );
    }  else {
    
    const getOneProduction = await query(
        `SELECT * FROM sch_production_management.production_tbl WHERE production_id = $1`,
        [obj.production_id]
    );

    if (getOneProduction.length > 0) {
        const weightDifference = obj.is_weight ? obj.actual_weight - getOneProduction[0].actual_weight : 0;
        const quantityDifference = !obj.is_weight ? obj.actual_quantity - getOneProduction[0].actual_quantity : 0;

        await query(
            `UPDATE sch_production_management.production_tbl SET
            actual_weight = $1,
            actual_quantity = $2,
            is_weight = $3,
            user_id = $4,
            updated_at = $5
            WHERE production_id = $6`,
            [
                obj.is_weight ? obj.actual_weight : getOneProduction[0].actual_weight,
                !obj.is_weight ? obj.actual_quantity : getOneProduction[0].actual_quantity,
                obj.is_weight,
                obj.user_id,
                new Date(),
                obj.production_id,
            ]
        );

        if (weightDifference !== 0 || quantityDifference !== 0) {
            const stocklistRecord = await query(
                `SELECT * FROM sch_product_management.stocklist_history_tbl WHERE stocklist_history_id = $1`,
                [obj.stocklist_history_id]
            );

            if (stocklistRecord.length > 0) {
                await query(
                    `UPDATE sch_product_management.stocklist_history_tbl SET
                    weight = weight + $1,
                    quantity = quantity + $2
                    WHERE stocklist_history_id = $3`,
                    [weightDifference, quantityDifference, obj.stocklist_history_id]
                );
            }
        }
         if (weightDifference !== 0 || quantityDifference !== 0) {
            await abstractFromProductTable(obj.product_id, obj.is_weight, weightDifference + quantityDifference);
        }
    }
}
    response(res, obj);
}

exports.productionQty = async (req, res) => {
    const { production_id, unit_qty } = req.body;

    const result = await query(
        `UPDATE sch_production_management.production_history_tbl SET unit_qty = $1 WHERE production_id = $2`,
        [unit_qty, production_id],
    );

    response(res, result);
}

exports.onTotalPacketUpdate = async (req, res) => {
    const { production_id, total_qty } = req.body;

    const result = await query(
        `UPDATE sch_production_management.production_history_tbl SET total_qty = $1 WHERE production_id = $2`,
        [total_qty, production_id],
    );

    response(res, result);
}