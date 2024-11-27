import mongoose from 'mongoose'

export function connectToDB(url) {
    mongoose.connect(url)
        .then(() => { console.log('MonogDB Connected SucesFully...') })
        .catch((err) => { console.log('Failed To Connect to MongoDB: ', err) })
}