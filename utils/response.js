const response = (res, queryData, obj, filterProductsDefaultValues) => {
    if (queryData) {
        return res.status(200).json({
            message: "Success",
            result: queryData,
            obj,
            filterProductsDefaultValues,
        });
    } else {
        return res.status(404).json({
            message: "Database query error",
        });
    }
};
  
exports.response = response;
  