import { Kafka, logLevel } from "kafkajs";
export const kafka = new Kafka({
  brokers: ["100.24.91.31:9092"], // EC2 Kafka broker
  logLevel: logLevel.ERROR,
  // ssl: false,           // Don't need this
  // sasl: {...}           // Don't use this
});
export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "chats" });
export const connectKafkaProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka producer connected...");
  } catch (error) {
    console.error("Failed to connect to Kafka producer", error);
  }
};
