import { USER } from "../model/users.js"

export async function isAuthenticated(req, res, next) {
    try {
        const user = await USER.findById(req.session.userId);
        if (user) {
            req.user = user;
            return next();
        }
        return res.redirect('/');
    } catch (error) {
        console.log('Error in isAuthenticated middleware. Error:', error)
    }
}