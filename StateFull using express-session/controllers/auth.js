import { USER } from "../model/users.js";

export async function handleLogin(req, res) {
    try {
        const { username, password } = req.body;
        if(!username || !password){
          return  res.status(500).render('login', { message: 'Username and Password Required' })
        }
        const user = await USER.findOne({ username });

        //* Check User is Available or not.
        if(!user){
            return  res.status(500).render('login', { message: "Can't Find User" })
          }
          
        //* Verify username and password. 
        if (!username || !(await user.comparePassword(password))) {
          return  res.status(500).render('login', { message: 'Invalid Crediantials' })
        }

        req.session.userId = user._id;        //* Set the Data in the Session.
        req.session.username = user.username; 
        req.session.save((err) => {
            if (err) {
             return   res.status(500).render('error', { err })
            }
           return res.status(200).redirect('/profile')
        })
    } catch (error) {
        console.log('Error in handleLogin Controller', error)
        res.status(500).render('error', { error })
    }
}

export async function handleSignup(req, res) {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            res.status(500).render('signup',{ message: 'Fill out all Details' })
        }

        const user = await USER.create({ username, email, password }) //* Create User.
        req.session.userId = user._id;        //* Set the Data in the Session.
        req.session.username = user.username; 
        req.session.save((err) => {
            if (err) {
             return   res.status(500).render('error', { err })
            }
           return res.status(200).redirect('/profile')
        })

    } catch (error) {
        console.log('Error in handleSignup Controller', error)
        res.status(500).render('error', { error })
    }
}

export async function handleLogout(req, res) {
    try {
        //* Clear the session in cookie and in server.
        if (req.session) {
            req.session.destroy((err) => {      //* in server memmory(RAM).

                if (err) {
                    return res.status(500).json({ message: 'Unable to destroy session', error: err });
                }

                res.clearCookie('sessionId')      //* in Client Browswer (cookie).
                res.status(200).redirect('/')
            });
        }
    } catch (error) {
        console.log('Error in handleLogout Controller', error)
        res.status(500).render('error', { error })
    }
}