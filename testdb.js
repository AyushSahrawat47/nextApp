import mongoose from 'mongoose';
const connectDB = async () =>{
    try {
        const db = await mongoose.connect('mongodb+srv://ayush:RepNvUF9f6FW1fsB@personal.8t2we.mongodb.net/test123');
        console.log('MongoDB connected...', db.connections);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

connectDB();