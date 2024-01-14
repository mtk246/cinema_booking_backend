const { query } = require("../src/config/pg_connection");
const uuid = require("uuid");
const { response } = require('../utils/response');
const moment = require('moment');

/**
 * CRUD for purchase bill type
 */
exports.getBill = async (req, res) => {
    const {bill_type_id} = req.query;
    let rows;

    if(bill_type_id){
        rows = await query(
            `SELECT *
            FROM sch_purchase_management.bill_type_tbl
            WHERE bill_type_id = $1`,
            [bill_type_id],
        );
    }else{
        rows = await query(
            `SELECT * 
            FROM sch_purchase_management.bill_type_tbl`,
        );
    }
    response(res, rows);
}

exports.postBill = async (req, res) =>{
    const { bill_type_name }= req.body;

    const obj = {
        bill_type_id: uuid.v4(),
        bill_type_name: bill_type_name,
        created_at: new Date(),
    }

    await query(
        `INSERT INTO sch_purchase_management.bill_type_tbl
        (bill_type_id, bill_type_name, created_at) VALUES ($1, $2, $3)`,
        [
            obj.bill_type_id,
            obj.bill_type_name,
            obj.created_at,
        ]
    );
    response(res, obj);
}

exports.putBill = async (req, res) =>{
    const {bill_type_id, bill_type_name} = req.body;

    const obj = {
        bill_type_id: bill_type_id,
        bill_type_name: bill_type_name,
        updated_at: new Date(),
    };

    await query(
        `UPDATE sch_purchase_management.bill_type_tbl SET 
        bill_type_name = $1, updated_at = $2 WHERE bill_type_id = $3`,
        [
            obj.bill_type_name,
            obj.updated_at,
            obj.bill_type_id
        ]
    );
    response(res, obj);
}

/**
 * CRUD for purchase type
 */

exports.getPurchaseType = async (req, res) => {
    const { balance_type_id } = req.query;

    let rows;

    if (balance_type_id) {
        rows = await query(
            `SELECT
                *
            FROM sch_purchase_management.balance_type_tbl
            WHERE balance_type_id = $1`,
            [balance_type_id],
        );
    } else {
        rows = await query(
            `SELECT
                *
            FROM sch_purchase_management.balance_type_tbl `,
        );
    }

    response(res, rows);
}

exports.postPurchaseType = async (req, res) => {
    const { balance_type_name } = req.body;

    const obj = {
        balance_type_id: uuid.v4(),
        balance_type_name: balance_type_name,
        created_at: new Date(),
    };

    await query(
        `INSERT INTO sch_purchase_management.balance_type_tbl (balance_type_id, balance_type_name, created_at) VALUES ($1, $2, $3)`,
        [
            obj.balance_type_id,
            obj.balance_type_name,
            obj.created_at,
        ]
    );

    response(res, obj);
}

exports.putPurchaseType = async (req, res) => {
    const { balance_type_id, balance_type_name } = req.body;

    const obj = {
        balance_type_id: balance_type_id,
        balance_type_name: balance_type_name,
        updated_at: new Date(),
    };

    await query(
        `UPDATE sch_purchase_management.balance_type_tbl SET balance_type_name=$1, updated_at=$2 WHERE balance_type_id=$3`,
        [
            obj.balance_type_name,
            obj.updated_at,
            obj.balance_type_id,
        ]
    );

    response(res, obj);
}

/** 
 * purchase
*/
exports.get = async (req, res) => {
    const { purchase_id, start_date, end_date } = req.query;

    let currentDate;
    let today;
    let yesterday;
    let startDate;
    let endDate;

    if (start_date !== 'today' && start_date !== 'yesterday') {
        const parseStartDate = moment.tz(start_date, 'YYYY-MM-DD HH:mm:ss.SSS', 'UTC');
        startDate = parseStartDate.tz('Asia/Yangon').format('YYYY-MM-DD');

        const parseEndDate = moment.tz(end_date, 'YYYY-MM-DD HH:mm:ss.SSS', 'UTC');
        endDate = parseEndDate.tz('Asia/Yangon').format('YYYY-MM-DD');
    } 
    else {
        currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        yesterday = new Date(currentDate);
        yesterday.setDate(yesterday.getDate() - 1);

        today = new Date(currentDate);
        today.setDate(today.getDate() + 1);
    }
    
    let result = `SELECT * FROM sch_purchase_management.purchase_tbl p
        INNER JOIN sch_voucher_management.purchase_voucher_tbl v ON v.purchase_id = p.purchase_id
    `;

    if (currentDate && today && yesterday) {
        if (start_date !== 'today' && start_date !== 'yesterday') {
            result += ` WHERE DATE_TRUNC('day', p.created_at) >= $1 AND DATE_TRUNC('day', p.created_at) <= $2`;
        } else if (start_date === 'today') {
            result += ` WHERE p.created_at >= $1 AND p.created_at < $2`;
        } else if (start_date === 'yesterday') {
            result += ` WHERE p.created_at >= $1 AND p.created_at < $2`;
        }
    }
    
    let queryParams = [];
    
    if (start_date !== 'today' && start_date !== 'yesterday') {
        queryParams = [startDate, endDate];
    } else if (start_date === 'today') {
        queryParams = [currentDate, today];
    } else if (start_date === 'yesterday') {
        queryParams = [yesterday, currentDate];
    }

    let rows = [];

    if (purchase_id) {
        const result = `SELECT *, s.total_amount
        FROM sch_purchase_management.purchase_tbl p
            INNER JOIN sch_voucher_management.purchase_voucher_tbl v ON v.purchase_id = p.purchase_id
            INNER JOIN (
                SELECT purchase_id, SUM(total_amount) AS total_amount
                FROM sch_product_management.stocklist_history_tbl s
                GROUP BY purchase_id
            ) s ON s.purchase_id = p.purchase_id
        WHERE p.purchase_id = $1`;

        rows = await query(result, [purchase_id]);

        if (rows.length > 0) {
            const getRelatedProductData = await query(
                `SELECT
                    p.purchase_id,
                    s.purchase_product_id,
                    product.product_name,
                    s.quantity,
                    s.unit_price,
                    s.total_amount,
                    s.packaging_type_id,
                    p.user_id,
                    p.created_at,
                    p.updated_at,
                    pt.packaging_type_name
                FROM sch_product_management.stocklist_history_tbl s
                    INNER JOIN sch_purchase_management.purchase_tbl p ON p.purchase_id = s.purchase_id
                    INNER JOIN sch_product_management.product_tbl product ON product.product_id = s.product_id
                    INNER JOIN sch_product_management.packaging_type_tbl pt ON pt.packaging_type_id = s.packaging_type_id
                WHERE s.purchase_id = $1
                `,
                [purchase_id],
            );

            const combinedArr = [...rows, {products: getRelatedProductData}];

            response(res, combinedArr);
        } else {
            response(res, rows);
        }
    } else {
        if (currentDate && today && yesterday) {
            rows = await query(result, [...queryParams]);
        } else {
            rows = await query(result);
        }

        response(res, rows);
    }
};

exports.post = async (req, res) => {
    const {
        user_id,
        purchase_detail_arr,
    } = req.body;

    const purchase_id = uuid.v4();

    if (purchase_detail_arr.length > 0) {
        try {
            await query(
                `INSERT INTO sch_purchase_management.purchase_tbl (purchase_id, user_id, created_at) VALUES ($1, $2, $3)`,
                [
                    purchase_id,
                    user_id,
                    new Date(),
                ]
            );

            for (const item of purchase_detail_arr) {
                let product_id = item.product_id;

                const existingProduct = await query(
                    `SELECT * FROM sch_product_management.product_tbl WHERE product_id = $1`,
                    [product_id]
                );

                if (existingProduct.length === 0) {
                    // Product doesn't exist, create a new one
                    const newProductId = uuid.v4();

                    await query(
                        `INSERT INTO sch_product_management.product_tbl (product_id, product_name, packaging_type_id, is_weight, buy_price, sell_price) VALUES ($1, $2, $3, $4, $5, $6)`,
                        [
                            newProductId,
                            item.product_name,
                            item.packaging_type_id,
                            item.is_weight,
                            item.buy_price,
                            item.sell_price,
                        ]
                    );

                    product_id = newProductId;
                } else {
                    const existingProductData = existingProduct[0];

                    if (item.is_weight) {
                        existingProductData.total_weight += item.weight;
                    } else {
                        existingProductData.quantity += item.quantity;
                    }

                    // Update product_tbl with the new quantity, total_weight, buy_price, and sell_price
                    await query(
                        `UPDATE sch_product_management.product_tbl SET quantity = $1, total_weight = $2,  buy_price = $3, sell_price = $4 WHERE product_id = $5`,
                        [
                            existingProductData.quantity,
                            existingProductData.total_weight,
                            item.buy_price,
                            item.sell_price,
                            product_id,
                        ]
                    );
                }

                const purchaseProductId = uuid.v4();
                const stockListHistoryId = uuid.v4();

                const totalAmount = item.is_weight
                    ? item.weight * item.unit_price
                    : item.quantity * item.unit_price;

                // stocklist_history_tbl
                await query(
                    'INSERT INTO sch_product_management.stocklist_history_tbl (stocklist_history_id, purchase_product_id, purchase_id, quantity, unit_price, total_amount, product_id, packaging_type_id, is_weight, weight, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
                    [
                        stockListHistoryId,
                        purchaseProductId,
                        purchase_id,
                        item.is_weight ? 0 : item.quantity,
                        item.unit_price,
                        totalAmount,
                        product_id,
                        item.packaging_type_id,
                        item.is_weight,
                        item.is_weight ? item.weight : 0,
                        new Date(),
                    ]
                );
            }

            await query(
                `INSERT INTO sch_voucher_management.purchase_voucher_tbl (purchase_id, created_at) VALUES ($1, $2)`,
                [
                    purchase_id,
                    new Date(),
                ]
            );

            response(res, req.body);
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({
                "message": "Internal Server Error"
            });
        }
    } else {
        return res.status(400).json({
            "message": "Purchase Detail is empty"
        });
    }
}



exports.update = async (req, res) => {
    const { cat_id, cat_name } = req.body;

    const category = {
        cat_id,
        cat_name,
        updated_at: new Date(),
    }

    const result = "UPDATE category SET category_name = $1, updated_at = $2 WHERE category_id = $3";

    const rows = await query(
        result,
        [
            category.cat_name,
            category.updated_at,
            category.cat_id,
        ]
    );

    response(res, rows, category);
}
