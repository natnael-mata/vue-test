require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vue-test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error. Ensure MongoDB is running:', err));

// Define User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Handle new form submission
app.post('/api/contact', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    try {
        // const newUser = new User({ name, email });
        // await newUser.save();
        console.log(`Received user: ${name} (${email})`);
        res.status(200).json({ message: `hello ${name} and ur email is ${email}` });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Failed to process request.' });
    }
});

// Fetch all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running closely on http://localhost:${PORT}`);
});
