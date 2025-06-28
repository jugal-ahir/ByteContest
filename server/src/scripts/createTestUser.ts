import mongoose from 'mongoose';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

const createTestUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://vaghmashijugal:22102004Ahirjugal@cluster0.emd4w.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0');
        
        // Check if test user already exists
        const existingUser = await User.findOne({ userEmail: 'test@student.com' });
        if (existingUser) {
            console.log('Test user already exists');
            return;
        }
        
        // Create test user
        const hashedPassword = bcrypt.hashSync('test123', bcrypt.genSaltSync(10));
        const testUser = new User({
            userEmail: 'test@student.com',
            userPassword: hashedPassword,
            userName: 'Test Student',
            userRollNumber: 'TEST001',
            userSection: '1', // Make sure this matches your contest section
            userIsAdmin: false,
            userTeamName: 'Test Team'
        });
        
        await testUser.save();
        console.log('Test user created successfully');
        console.log('Email: test@student.com');
        console.log('Password: test123');
        console.log('Roll Number: TEST001');
        console.log('Section: 1');
        
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        await mongoose.disconnect();
    }
};

createTestUser(); 