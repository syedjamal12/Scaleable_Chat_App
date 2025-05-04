import { Kafka, logLevel } from "kafkajs";
export const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER],
    // authenticationTimeout: 10000,
    // reauthenticationThreshold: 10000,
    logLevel: logLevel.ERROR
});
// export const kafka = new Kafka({
//   brokers: [process.env.KAFKA_BROKER],
//   // authenticationTimeout: 10000,
//   // reauthenticationThreshold: 10000,
//   ssl: {
//       ca: fs.readFileSync(path.resolve("./certs/ca.pem"), "utf-8")
//   },
//   sasl: {
//     mechanism: 'plain', // scram-sha-256 or scram-sha-512
//     username: process.env.KAFKA_USERNAME,
//     password: process.env.KAFKA_PASSWORD,
//   },
//   logLevel: logLevel.ERROR
// })
console.log("broker", process.env.KAFKA_BROKER);
console.log("username", process.env.KAFKA_USERNAME);
console.log("pass", process.env.KAFKA_PASSWORD);
export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "chats" });
export const connectKafkaProducer = async () => {
    await producer.connect();
    console.log("kafka producer connected...");
};
