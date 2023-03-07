import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI as string;

let connection: any = null;
const dbConnect = async () => {
  try {
    if (!connection) {
      connection = await mongoose.connect(uri);
      console.log('Mongo Reconnected');
    } else {
      console.log('Mongo Connected');
    }
    return connection;
  } catch (error) {
    console.log('db connection fail: ', error);
  }
};

export default dbConnect;
