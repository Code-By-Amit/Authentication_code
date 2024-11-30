import { v4 as uuidv4 } from 'uuid';
const sessionStore = new Map() // Hash Map a Data Structure that Store Data in kay:value pair

function storeUserSession(user) {                       //* Session id ⬇️                                 User data ⬇️
    const sessionId = uuidv4();                         //* '20d22095-4a82-4d1e-af7d-6c5552ad4e9f' => {   userId: new ObjectId('673f01acad1cde2bf7d16054'),
    const payload = {                                   //*                                               username: 'Amitsaini',
        'userId': user._id,                             //*                                               expire: 1732186844558  }
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

setInterval(cleanUpExpiredSessions, 30 * 60 * 1000);       //* runs in every 30 min to clean up expired session from server(Ram)

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
