import React, { useEffect, useState } from "react";
import StockOrderForm from "./StockOrderForm";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const StockMarket = ({ stockData, userPortfolio, user }) => {
   //state about order details when buying/selling a stock
   const [orderDetails, setOrderDetails] = useState({
      orderID: "",
      userID: "",
      order_type: "buy",
      ticker: "",
      quantity: "",
      price: "",
      order_time: "",
      order_status: "",
   });

   //state for returning a message when user buys/sells a stock:
   const [orderFeedback, setOrderFeedback] = useState("");

   //state for order status (a property of orderDetails)
   // const  [orderStatus, setOrderStatus] = useState(orderDetails.orderStatus)

   // handle user input on the form when placing a buy/sell order, passed as props to the StockOrderForm.js
   const handleChange = (e) => {
      const { name, value } = e.target;
      setOrderDetails({ ...orderDetails, [name]: value });
   };

   // handle submit of form, passed as props to StockOrderForm.js
   const handleSubmit = () => {
      //set the remaining body of orderDetails:

      console.log("order: ", orderDetails);
      sendTradeOrder();
   };

   const sendTradeOrder = async () => {
      //complete the orderDetails then send order to back-end
      orderDetails.orderID = uuidv4();
      orderDetails.userID = user.user_id;
      orderDetails.order_time = new Date();
      orderDetails.order_status = "Pending";

      try {
         await axios.post("http://localhost:5555/sendTradeOrder2", {
            // user,
            orderDetails,
         });

         console.log("buy order sent");
         console.log(orderDetails);

         // setOrderFeedback(
         //    `${user.name}'s ${orderDetails.order_type} order for ${orderDetails.quantity} shares of ${orderDetails.ticker} at ${orderDetails.price} $ was sent`
         // );
      } catch (err) {
         console.log("did not send", err);
      }
   };

   return (
      <div className="stock-market">
         <StockOrderForm
            orderDetails={orderDetails}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
         />

         <br></br>
         <div>{orderFeedback}</div>
         {/* <br></br> */}
         {/* <div>Order Status: {orderDetails.orderStatus}</div> */}
      </div>
   );
};

export default StockMarket;
