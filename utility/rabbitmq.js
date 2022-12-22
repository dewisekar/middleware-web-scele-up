const amqp = require("amqplib");

// const sendToTheQueueOld = async (queue_name, message) => {
//   let status = true;
//   try {
//     amqp.connect("amqp://localhost", function (error0, connection) {
//       if (error0) {
//         throw error0;
//       }
//       connection.createChannel(function (error1, channel) {
//         if (error1) {
//           throw error1;
//         }
//         var queue = queue_name;
//         var msg = message;
//         console.log("msg:", msg);
//         channel.assertQueue(queue, {
//           durable: false,
//         });

//         channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
//           persistent: true,
//         });
//         status = true;
//         console.log(" [x] Sent %s", msg);
//       });
//       setTimeout(function () {
//         connection.close();
//       }, 500);
//     });
//   } catch (err) {
//     status = false;
//     console.error(err);
//   }
//   return status;
// };

const sendToTheQueue = async (queue_name, message) => {
  let status = false;
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue(queue_name, { durable: true });
    await channel.sendToQueue(
      queue_name,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
    console.log("Sending message to number queue");
    await channel.close();
    await connection.close();
    status = true;
  } catch (err) {
    console.error(err);
  }
  return status;
};
module.exports = { sendToTheQueue };
