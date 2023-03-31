export const rabbitMQConfig = {
  host: 'localhost',
  port: 5672,
  username: 'guest',
  password: 'guest',
  queueName: 'mail',
  queueOptions: {
    durable: true,
  },
  exchange: {
    name: 'mail',
    type: 'direct',
  },
  routingKey: 'mail',
};
