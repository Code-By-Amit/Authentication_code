import express from 'express';
import { connectToDB } from './dbConnection.js';
import authRoute from './routes/auth.js';
import { checkForAuthentication } from './middlewares/auth.js';
import cookieParser from 'cookie-parser';
const app = express();
const PORT = 3000;

// Serving Static Files 
app.use(express.static('public'));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));         
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoute);

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Connect to the database (this function connects to DB)
connectToDB('mongodb://localhost:27017/AuthPractice')

app.get('/', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/profile', checkForAuthentication, (req, res) => {
    try {
        const { username, email, _id } = req.user;
        res.status(200).render('profile', { username, email, _id })
    } catch (error) {
        res.status(500).render('error', { error })
    }
})


app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`)
})