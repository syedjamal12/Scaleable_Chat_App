import { Kafka,logLevel } from "kafkajs";
import fs from 'fs'
import path from "path";

export const kafka = new Kafka({
    
 brokers: ['kafka:9092']
  ,
    // authenticationTimeout: 10000,
    // reauthenticationThreshold: 10000,
    logLevel: logLevel.ERROR
  })
console.log("broker",process.env.KAFKA_BROKER);
console.log("username",process.env.KAFKA_USERNAME)
console.log("pass",process.env.KAFKA_PASSWORD)

  export const producer = kafka.producer();
  export const consumer = kafka.consumer({groupId:"chats"})

  export const connectKafkaProducer = async()=>{
    await producer.connect();
    console.log("kafka producer connected...")
  }