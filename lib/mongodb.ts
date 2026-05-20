import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = (process.env.MONGODB_URI || process.env.MONGO_URI) as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI or MONGO_URI environment variable inside .env.local');
}

interface GlobalMongoose {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: GlobalMongoose;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts: ConnectOptions = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
            retryWrites: true,
            w: 'majority',
        };
        
        cached.promise = mongoose.connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log('MongoDB connected successfully');
                return mongoose;
            })
            .catch((error) => {
                cached.promise = null;
                console.error('MongoDB connection error:', error.message);
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

export default connectDB;