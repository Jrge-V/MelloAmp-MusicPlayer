const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        rquired: true,
    },
    email: {
        type: String,
        rquired: true,
    },
    imageURL: {
        type: String,
        rquired: true,
    },
    user_id: {
        type: String,
        rquired: true,
    },
    // email_verified: {
    //     type: Boolean,
    //     rquired: true,
    // },
    role: {
        type: String,
        rquired: true,
    },
    auth_time: {
        type: String,
        rquired: true,
    },
},
{timestamps : true}
);


module.exports = mongoose.model("user", UserSchema);