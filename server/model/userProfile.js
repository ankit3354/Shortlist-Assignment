const mongoose = require('mongoose')


const userProfileSchema = mongoose.Schema({
    RoleName: {
        type: String
    },
    contactNumbers: { type: String, unqiue: true },
    description: {
        type: String
    },
    rate: {
        type: String
    },
    project: { type: Number },
    year: { type: Number },
    shortlistStatus: { type: Boolean, default: false }
}, { timestamps: true })

const UserProfile = mongoose.model('userprofile', userProfileSchema)

module.exports = UserProfile