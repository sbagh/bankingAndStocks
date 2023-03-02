const amqp = require("amqplib");

const QueueName = "stock_orders";
const RabbitMqUrl = "amqp://127.0.0.1:5672";

const recieveFromStockOrdersQueue = async () => {
   try {
      //create connection
      const subscriberConnection = await amqp.connect(RabbitMqUrl);
      //create channel
      const subscriberChannel = await subscriberConnection.createChannel();
      //assert queue
      await subscriberChannel.assertQueue(QueueName, { durable: true });
      //consume message from queue
      await subscriberChannel.consume(QueueName, (consumedMessage) => {
         if (consumedMessage) {
            // console.log("consumed message:  ", consumedMessage);
            // ensure message is a valid object
            if (
               typeof consumedMessage.content !== "object" ||
               !consumedMessage.content
            ) {
               console.log("Invalid message format");
               return null;
            }

            //parse content of incoming message
            const orderDetails = JSON.parse(consumedMessage.content.toString());
            console.log("recieved message from queue: ", orderDetails);
            // acknowledge message consumed from que
            subscriberChannel.ack(consumedMessage);
            //return contents
            return orderDetails;
         } else {
            console.log("no messages in que");
         }
      });
   } catch (error) {
      console.log("error in consuming message from stock ordering que", error);
      throw error;
   }
   // } finally {
   //    // close channel and connection when finished
   //    if (subscriberChannel) {
   //       await subscriberChannel.close();
   //    }
   //    if (subscriberConnection) {
   //       await subscriberConnection.close();
   //    }
   // }
};

module.exports = {
   recieveFromStockOrdersQueue,
};
