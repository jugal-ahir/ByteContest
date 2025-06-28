// importing libraries
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({     // configure dotenv
    path: "../../.env"  // set path of env
});
const connectDB = async () => {

    try {
        // connecting with the Database through atlas via mongoose.connect() method
        console.log(`${process.env.MONGODB_URI}`)
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
        
        // Drop old indexes that might conflict
        try {
            const db = mongoose.connection.db;
            const collections = await db.listCollections().toArray();
            
            // Check if users collection exists
            const usersCollection = collections.find(col => col.name === 'users');
            if (usersCollection) {
                console.log('Users collection found, checking indexes...');
                
                // Drop the old email index if it exists
                try {
                    await db.collection('users').dropIndex('email_1');
                    console.log('Dropped old email_1 index');
                } catch (error) {
                    console.log('email_1 index not found or already dropped');
                }
                
                // Drop any other conflicting indexes
                try {
                    await db.collection('users').dropIndex('userEmail_1');
                    console.log('Dropped old userEmail_1 index');
                } catch (error) {
                    console.log('userEmail_1 index not found or already dropped');
                }
                
                try {
                    await db.collection('users').dropIndex('userRollNumber_1');
                    console.log('Dropped old userRollNumber_1 index');
                } catch (error) {
                    console.log('userRollNumber_1 index not found or already dropped');
                }
                
                try {
                    await db.collection('users').dropIndex('firebaseUid_1');
                    console.log('Dropped old firebaseUid_1 index');
                } catch (error) {
                    console.log('firebaseUid_1 index not found or already dropped');
                }
            }
        } catch (error) {
            console.log('Error managing indexes:', error);
        }
        
    } catch (error) {
        // Error Handling
        console.error("MongoDB Connection Error:  ", error);
        process.exit(1);
    }
}


export default connectDB;