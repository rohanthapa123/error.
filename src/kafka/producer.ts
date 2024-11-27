import { ErrorWithCustomMessage, logger } from '@krezona/common-library';
import Kafka from 'node-rdkafka';
// Load all the environments here
import { config } from 'dotenv';

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

// Determine environment-specific configurations
const clientId = (process.env.NODE_ENV === 'production') ? process.env.KAFKA_CLIENT : process.env.KAFKA_CLIENT_DEVELOPMENT;
const brokers = (process.env.NODE_ENV === 'production') ? process.env.KAFKA_BROKERS : process.env.KAFKA_BROKERS_DEVELOPMENT;
const username = (process.env.NODE_ENV === 'production') ? process.env.KAFKA_USERNAME : process.env.KAFKA_USERNAME_DEVELOPMENT;
const password = (process.env.NODE_ENV === 'production') ? process.env.KAFKA_PASSWORD : process.env.KAFKA_PASSWORD_DEVELOPMENT;

// Kafka Producer Configuration with Retry Settings
const producer = new Kafka.Producer({
  'metadata.broker.list': brokers,
  'dr_cb': true,  // Delivery report callback
  'security.protocol': 'sasl_ssl',
  'sasl.mechanisms': 'PLAIN',
  'sasl.username': username,
  'sasl.password': password,
  'client.id': clientId,
  'message.send.max.retries': 1, 
  'retry.backoff.ms': 1000, // Retry backoff time in milliseconds
  'queue.buffering.max.ms': 100, // Maximum time to buffer messages before sending
  'socket.timeout.ms': 30000, // Timeout for network requests
}, {
  // Topic-specific configuration
  'request.required.acks': -1 // Wait for all replicas to acknowledge
});

// Connect the producer
producer.connect();

producer.on('ready', () => {
  logger.info('Kafka Producer is connected and ready.');
});

producer.on('event.error', (err) => {
  logger.error('Error from Kafka Producer');
  logger.error(err);
});

producer.on('delivery-report', (err, report) => {
  if (err) {
    logger.error('Delivery report error:', err);
  } else {
    logger.info('Delivery report:', report);
  }
});

export { producer };
