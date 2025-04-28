import prisma from "./config/db.config.js";
import { consumer, producer } from "./config/kafka.config.js";

export const produceMessage = async (topic: string, message: any) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

export const consumeMessage = async (topic: string) => {
  await consumer.connect();
  await consumer.subscribe({ topic: topic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log("consumer data", data);
      console.log("Counter Reply Type:", typeof data.counter_reply);
console.log("Counter Reply Value:", data.counter_reply);
// let formattedCounterReply = null
// try{
//   formattedCounterReply =
//   data.counter_reply ? JSON.parse(data.counter_reply) : null;
// }catch(e){
// console.log("erorrrrr",e)

// }
// console.log("coter reply backend",formattedCounterReply)


      await prisma.chats.create({
          data:{
            group_id: data.group_id,
                message: data.message,
                name: data.name,
                media_url : data.media_url,
                media_type: data.media_type,
                profile_image: data.profile_image,
                counter_reply:data?.counter_reply || null
          }
      }).catch(error => {
        console.error("Prisma Error:", error);
      });
    },
  });
};
