import jwt from 'jsonwebtoken'
const SECRET='abcdefghijklmnopqrst'
function checkForAuthentication(req, res, next) {
    try {

        const tokenCookie = req.cookies?.jwt;                       //* check is token available in request obj 
        if (!tokenCookie) res.redirect('/');                        //* if not availabe then redirect to login page    
        const user = jwt.verify(tokenCookie, SECRET);               //* if availabe  verify token using secret 
        req.user = user;                                            //* add user data in req object ,(we use _id of user to get more info about user from Database if needed)
        return next();

    } catch (error) {
        console.log('Error in authentication Middleware: ', error)
        res.render('error', { error })
    }
}

export { checkForAuthentication }

