import * as mongoose from 'mongoose';
import config from '../config/index';

const username = config.MONGODB_USERNAME;
const password = config.MONGODB_PASSWORD;
const cluster = config.MONGODB_CLUSTER;
const database = config.MONGODB_DATABASE;

const MONGO_URI = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${database}?retryWrites=true&w=majority`;
mongoose.connect(MONGO_URI);
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB run error: ', error);
});
db.once('open', () => {
  console.log('====> Connected to MongoDB :)');
});
process.on('exit', () => {
  db.close();
});
export default mongoose;
