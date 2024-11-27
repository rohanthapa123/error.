// Load all the environments here
import { config } from 'dotenv';
import { ErrorWithCustomMessage, logger } from '@krezona/common-library';

const envFile =
  process.env.NODE_ENV === 'test'
    ? '.env.test'
    : process.env.NODE_ENV === 'development'
    ? '.env.dev'
    : '.env';
logger.info(envFile);
config({ path: envFile });

if (process.env.NODE_ENV === 'production') {
  if (
    !process.env.KAFKA_BROKERS ||
    !process.env.KAFKA_USERNAME ||
    !process.env.KAFKA_PASSWORD ||
    !process.env.KAFKA_CLIENT
  ) {
    logger.error(
      'One or more environment variables not loaded properly, from kafka config.ts'
    );
    throw new ErrorWithCustomMessage(`Service unavailable.`, 503);
  }
}
if (process.env.NODE_ENV === 'development') {
  if (
    !process.env.KAFKA_BROKERS_DEVELOPMENT ||
    !process.env.KAFKA_USERNAME_DEVELOPMENT ||
    !process.env.KAFKA_PASSWORD_DEVELOPMENT ||
    !process.env.KAFKA_CLIENT_DEVELOPMENT
  ) {
    logger.error(
      'One or more environment variables not loaded properly, from kafka config.ts'
    );
    throw new ErrorWithCustomMessage(`Service unavailable.`, 503);
  }
}

if (process.env.NODE_ENV === 'test') {
  throw new ErrorWithCustomMessage(
    'Testing is done only for unit services',
    503
  );
}

const clientId = (process.env.NODE_ENV === 'production') ? process.env.KAFKA_CLIENT : process.env.KAFKA_CLIENT_DEVELOPMENT;
const brokers = (process.env.NODE_ENV === 'production') ? process.env.KAFKA_BROKERS!.split(',') : process.env.KAFKA_BROKERS_DEVELOPMENT!.split(',');
// const topics = (process.env.NODE_ENV === 'production') ? process.env.KAFKA_TOPICS!.split(',') : process.env.KAFKA_TOPICS_DEVELOPMENT!.split(',');
const username = (process.env.NODE_ENV === 'production') ? process.env.KAFKA_USERNAME : process.env.KAFKA_USERNAME_DEVELOPMENT;
const password = (process.env.NODE_ENV === 'production') ? process.env.KAFKA_PASSWORD : process.env.KAFKA_PASSWORD_DEVELOPMENT;

import { KafkaConsumer, CODES } from 'node-rdkafka';
import { Subscriber } from './subscriber';
import { AppDataSource } from '../data-source';
import { KafkaError } from '../entity/KafkaError';


const keyToSubscriberMap: { [key: string]: keyof typeof Subscriber } = {

};

// Initialize Kafka consumer
// const consumer = new KafkaConsumer(
//   {
//     'group.id': clientId,
//     'metadata.broker.list': brokers.join(','),
//     'security.protocol': 'sasl_ssl',
//     'sasl.mechanisms': 'PLAIN',
//     'sasl.username': username,
//     'sasl.password': password,
//     'enable.auto.commit': false, // Disable auto-commit
//   },
//   {}
// );

// AppDataSource.initialize()
//   .then(async () => {
//     consumer.connect();

//     consumer.on('ready', () => {
//       logger.info('Consumer ready. Subscribing to topic...');
//       consumer.subscribe(topics);

//       consumer.consume();
//       logger.info('Consumer ready. Subscribed to topics');
//     });

//     consumer.on('data', async (message) => {
      
//       if (!message.key) {
//         throw new ErrorWithCustomMessage(
//           `Please include a key while sending message`,
//           404
//         );
//       }
//       const key = message.key.toString();
      
//       if (!message.value) {
//         throw new ErrorWithCustomMessage(
//           `Can't find message value produced by producer. Please make sure to include message`,
//           404
//         );
//       }
//       const value = JSON.parse(message.value.toString());

//       try {
//         if (key in keyToSubscriberMap) {
//           const subscriberFunction = Subscriber[keyToSubscriberMap[key]] as (value: any) => Promise<void>;
//           try{
//             await subscriberFunction(value);
//             // Manually commit the offset after successful processing
//             consumer.commit(message);
//           }catch(error){
//             throw new ErrorWithCustomMessage(`Error occurred during handling the expected case`,500);
//           }

//         } else {
//           throw new ErrorWithCustomMessage(`No subscriber found for key: ${key}`, 404);
//         }
//       } catch (error: unknown) {
//         // const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//         // const kafkaErrorRepository = AppDataSource.getRepository(KafkaError);
//         // await kafkaErrorRepository.save({
//         //   key,
//         //   value,
//         //   errorMessage,
//         //   topic: message.topic,
//         //   partition: message.partition,
//         //   offset: message.offset,
//         //   timestamp: new Date(),
//         // });
//         logger.info("Error occurred: ", error);
//       }
//     });

//     consumer.on('event.error', (err) => {
//       console.error('Error from consumer');
//       console.error(err);
//     });
//   })
//   .catch((error) => {
//     logger.error('Error during Data Source initialization:', error);
//   });
