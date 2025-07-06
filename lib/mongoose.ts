import mongoose from 'mongoose';

let isConnected = false; //check connection to mongoose

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL) return console.log('MONGODB_URL not found');
    if (isConnected) return console.log('MONGODB_URL already connected');

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
    }
}