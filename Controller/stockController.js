const { query } = require("../src/config/pg_connection");
const { response } = require('../utils/response');

/**stocklist history tbl */
exports.getStockList = async (req, res) => {
    const { product_id } = req.query;

    try {
        let rows;

        if (product_id) {
            rows = await query(
                `SELECT
                    s.product_id,
                    p.product_name,
                    s.quantity,
                    s.packaging_type_id,
                    pt.packaging_type_name,
                    p.total_weight,
                    s.created_at,
                    s.updated_at,
                    s.unit_price,
                    s.is_weight
                FROM sch_product_management.stocklist_history_tbl s
                INNER JOIN sch_product_management.product_tbl p ON p.product_id = s.product_id
                INNER JOIN sch_product_management.packaging_type_tbl pt ON pt.packaging_type_id = s.packaging_type_id
                WHERE product_id = $1
                ORDER BY s.created_at ASC
                `,
                [product_id],
            );
    
            const packaging = await query("SELECT * FROM sch_product_management.packaging_type_tbl");
            
            const combinedArr = [
                [...rows],
                [{packaging: packaging}]
            ];
    
            rows = combinedArr;
        } else {
            const result = `SELECT
                    s.product_id,
                    p.product_name,
                    s.quantity,
                    s.packaging_type_id,
                    pt.packaging_type_name,
                    p.total_weight,
                    s.created_at,
                    s.updated_at,
                    s.unit_price,
                    s.is_weight
                FROM sch_product_management.stocklist_history_tbl s
                INNER JOIN sch_product_management.product_tbl p ON p.product_id = s.product_id
                INNER JOIN sch_product_management.packaging_type_tbl pt ON pt.packaging_type_id = s.packaging_type_id
                ORDER BY s.created_at ASC
            `;
    
            rows = await query(result);
    
            const packaging = await query("SELECT * FROM sch_product_management.packaging_type_tbl");
            
            const combinedArr = [
                [...rows],
                [{packaging: packaging}]
            ];
    
            rows = combinedArr;
        }
    
        response(res, rows);
    } catch (e) {
        console.log(e);
        
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        })
    }
}