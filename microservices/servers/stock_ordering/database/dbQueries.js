const Pool = require("pg").Pool;

// connect to db:
const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "stock_ordering",
   host: "localhost",
   port: 5432,
});

// //get a user's trade orders
const getUserStockOrders = async (userID) => {
   try {
      const queryString =
         "SELECT order_type, ticker, quantity, price, order_status, order_time, order_id FROM stock_orders WHERE user_id = $1 ORDER BY order_time DESC ";
      const queryParameter = [userID];

      const results = await pool.query(queryString, queryParameter);

      // console.log(results.rows);

      // convert to camel case
      const camelCaseResults = results.rows.map((result) => {
         return {
            orderType: result.order_type,
            orderStatus: result.order_status,
            orderTime: result.order_time,
            orderID: result.order_id,
            ticker: result.ticker,
            quantity: result.quantity,
            price: result.price,
         };
      });
      return camelCaseResults;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

// add a stock trade order
const addStockOrder = async (orderDetails) => {
   try {
      const queryString =
         "INSERT INTO stock_orders (order_id, user_id, order_type, ticker, quantity, price, order_time, order_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
      const queryParameters = [
         orderDetails.orderID,
         orderDetails.userID,
         orderDetails.orderType,
         orderDetails.ticker,
         orderDetails.quantity,
         orderDetails.price,
         orderDetails.orderTime,
         orderDetails.orderStatus,
      ];
      await pool.query(queryString, queryParameters);
   } catch (error) {
      console.log("error in adding stock order to stock_orders table", error);
      throw error;
   }
};

// update order_status for both buy and sell orders to "Closed" in stock_orders table after matching
const updateOrderStatusStockOrdersTable = async (buyOrderID, sellOrderID) => {
   try {
      const queryString =
         "UPDATE stock_orders SET order_status =$1 WHERE order_id = $2 OR order_id = $3";
      const queryParameter = ["Closed", buyOrderID, sellOrderID];

      await pool.query(queryString, queryParameter);
   } catch (error) {
      console.log(error);
      throw error;
   }
};

// update order status to "Canceled" after received canceled order confirmation
const updateOrderStatusToCanceled = async (canceledOrder) => {
   try {
      const queryString =
         "UPDATE stock_orders SET order_status = $1 WHERE order_id = $2";
      const queryParameter = ["Canceled", canceledOrder.orderID];
      await pool.query(queryString, queryParameter);
   } catch (error) {
      console.log(error);
      throw error;
   }
};

module.exports = {
   getUserStockOrders,
   addStockOrder,
   updateOrderStatusStockOrdersTable,
   updateOrderStatusToCanceled,
};
