import * as mongoose from 'mongoose';
import config from '../config/index';

const username = config.MONGODB_USERNAME;
const password = config.MONGODB_PASSWORD;
const cluster = config.MONGODB_CLUSTER;
const database = config.MONGODB_DATABASE;

const MONGO_URI = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${database}?retryWrites=true&w=majority`;
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('====> Connected to MongoDB :)');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectToMongoDB;
