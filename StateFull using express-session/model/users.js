import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: { type: String, require: true },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
},
    { timestamps: true });


// * Hash the Password Before Storing into DB.
userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// * Compare the Password.
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}
 

const USER = mongoose.model('user', userSchema)

export { USER }