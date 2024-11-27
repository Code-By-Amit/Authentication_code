import JWT from "jsonwebtoken";
import { USER } from "../model/users.js";

const SECRET = 'abcdefghijklmnopqrst'

export async function handleLogin(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.render('login', { message: 'Username and Password Required' })
        }
        const user = await USER.findOne({ username });

        //* Check User is Available or not.
        if (!user) {
            return res.render('login', { message: "Can't Find User" })
        }

        //* Verify username and password. 
        if (!username || !(await user.comparePassword(password))) {
            return res.render('login', { message: 'Invalid Crediantials' })
        }

        const payload = {
            username: user.username,
            _id: user._id,
            email: user.email
        }
        const token = JWT.sign(payload, SECRET)

        res.cookie('jwt', token, { maxAge: 30 * 60 * 1000 })

        return res.redirect('/profile')

    } catch (error) {
        console.log('Error in handleLogin Controller', error)
        res.render('error', { error })
    }
}

export async function handleSignup(req, res) {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            res.render('signup', { message: 'Fill out all Details' })
        }

        const isUserExists = await USER.findOne({
            $or: [
                { username: username },
                { email: email },
            ],
        });

        if (isUserExists) {
            return res.render('signup', { message: 'Username or Email Already Exists' })
        }

        const user = await USER.create({ username, email, password }) //* Create User.
        if (!user) throw new Error('Error in creating user')
        const payload = {
            username: user.username,
            _id: user._id,
            email: user.email
        }
        const token = JWT.sign(payload, SECRET)
        res.cookie('jwt', token, { maxAge: 30 * 60 * 1000 })
        return res.status(201).redirect('/profile')

    } catch (error) {
        console.log('Error in handleSignup Controller', error)
        res.render('error', { error })
    }
}

export async function handleLogout(req, res) {
    try {

        const token = req.cookies?.jwt
        if (token) {
            res.clearCookie('jwt');        //* Clear cookie from client
        }
        res.redirect('/')                      //* redirect to login page
    } catch (error) {
        console.log('Error in handleLogout Controller', error)
        res.render('error', { error })
    }
}