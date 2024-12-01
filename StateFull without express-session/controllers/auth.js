import { USER } from "../model/users.js";
import { storeUserSession, deleteSession, sessionExists, sessionStore } from '../sessionStore.js'


export async function handleLogin(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(500).render('login', { message: 'Username and Password Required' })
        }
        const user = await USER.findOne({ username });

        //* Check User is Available or not.
        if (!user) {
            return res.status(500).render('login', { message: "Can't Find User" })
        }

        //* Verify username and password. 
        if (!username || !(await user.comparePassword(password))) {
            return res.status(500).render('login', { message: 'Invalid Crediantials' })
        }

             
       const sessionId = storeUserSession(user)     //*Generate a SessionId and Create a user session in server Memmory(RAM).
       console.log(sessionStore);   
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            maxAge: 30 * 60 * 1000,
            path: '/'
        })
        return res.status(200).redirect('/profile')

    } catch (error) {
        console.log('Error in handleLogin Controller', error)
        res.status(500).render('error', { error })
    }
}

export async function handleSignup(req, res) {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            res.status(500).render('signup', { message: 'Fill out all Details' })
        }

        const isUserExists = await USER.findOne({
            $or: [
                { username: username },
                { email: email },
            ],
        });

        if (isUserExists) {
           return res.status(500).render('signup', { message: 'Username or Email Already Exists' })
        }

        const user = await USER.create({ username, email, password }) //* Create User.
        if(!user) throw new Error('Error in creating user')  
         
        const sessionId = storeUserSession(user)                       //*Generate a SessionId and Create a user session in server Memmory(RAM).    
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            maxAge: 30 * 60 * 1000,
            path: '/'
        })
        return res.status(200).redirect('/profile')

    } catch (error) {
        console.log('Error in handleSignup Controller', error)
        res.status(500).render('error', { error })
    }
}

export async function handleLogout(req, res) {
    try {
        //* Clear the session in cookie and in server.
        const sessionId = req.cookies.sessionId;
        if (sessionId) {
            console.log(sessionExists(sessionId))
            if (sessionExists(sessionId)) {
                deleteSession(sessionId)          //* in server
                res.clearCookie('sessionId')      //* in Client Browswer (cookie).
            }
            res.status(200).redirect('/')     //* redirect to login page
        }
    } catch (error) {
        console.log('Error in handleLogout Controller', error)
        res.status(500).render('error', { error })
    }
}
