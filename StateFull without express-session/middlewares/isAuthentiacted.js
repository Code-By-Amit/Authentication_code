import { USER } from "../model/users.js"
import { getSessionData } from '../sessionStore.js'
export async function isAuthenticated(req, res, next) {
    try {
        const sessionId = req.cookies?.sessionId;
        if (!sessionId) return res.redirect('/')
        
        const data = getSessionData(sessionId);
        
        const user = await USER.findById(data.userId)
        if (user) {
            req.user = user;
            return next();
        }
        return res.redirect('/');
    } catch (error) {
        console.log('Error in isAuthenticated middleware. Error:', error)
        return res.status(500).send('Internal Server Error');
    }
} 