import { v4 as uuidv4 } from 'uuid';
const sessionStore = new Map() // Hash Map a Data Structure that Store Data in kay:value pair

function storeUserSession(user) {
    const sessionId = uuidv4();
    const payload = {
        'userId': user._id,
        'username': user.username,
        'expire': Date.now() + 30 * 60 * 1000          //* Set Expire Time 30 min. 
    }
    sessionStore.set(sessionId, payload)
    return sessionId;
}

function getSessionData(sessionId) {
    return sessionStore.get(sessionId);
}

function sessionExists(sessionId) {
    return sessionStore.has(sessionId);
}

function deleteSession(sessionId) {
    return sessionStore.delete(sessionId);
}

function cleanUpExpiredSessions() {
    const now = Date.now();
    sessionStore.forEach((value, key) => {
        if (value.expire && value.expire < now) {
            console.log(`Removing expired session with key: ${key}`);
            deleteSession(key);                                   //* Removes the expired session from the Map
        }
    })
}

setInterval(cleanUpExpiredSessions, 30 * 60 * 1000);       //* runs in every 30 min to clean up expired session from server 

export { sessionStore, storeUserSession, cleanUpExpiredSessions, getSessionData, sessionExists, deleteSession }


// export const sessionStore = {}  

// export function cleanUpSessions(){
//     const now = Date.now();
//     for(const sessionId in sessionStore){
//         if(sessionStore[sessionId].expiresAt < now){
//             delete sessionStore[sessionId]
//         }
//     }
// }

// // * Runs Every 15 Minutes.
// setInterval(cleanUpSessions, 15 * 60 * 1000);