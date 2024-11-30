import express from 'express';
import session from 'express-session';
import { connectToDB } from './dbConnection.js';
import authRoute from './routes/auth.js';
import { isAuthenticated } from './middlewares/isAuthentiacted.js';

const app = express();
const PORT = 3000;

app.use(session({                    //* By default, sessions are stored in the server's memory (RAM) using the MemoryStore.In production, you should use a dedicated session store like Redis, MongoDB, or MySQL to manage sessions. 
    name: 'sessionId',                      //* name of cookie to store in client browser
    secret: "SuperMan is my Secret Key",    //* secret key to create a session
    resave: false,                          
    saveUninitialized: false,
    cookie: { maxAge: 1800000 }             //* Expire Time
}));

// Serving Static Files 
app.use(express.static('public'));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));         
app.use(express.json());

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

app.get('/profile', isAuthenticated, (req, res) => {
    try {
        const { username, email, id } = req.user;
        res.status(200).render('profile', { username, email, id })
    } catch (error) {
        res.status(500).render('error', { error })
    }
})


app.listen(PORT, () => {
    console.log(`Server Started at http://localhost:${PORT}`)
})
