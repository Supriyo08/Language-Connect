import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://akashmaji200680:4z2w5e5Hc4QTE1Wi@cluster01.xgihl1k.mongodb.net/languagekonnect';

let isConnected = false;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Server will continue without MongoDB. API endpoints will return mock data.');
    isConnected = false;
    return null;
  }
};

export const isDBConnected = () => isConnected;

export default mongoose;
