const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
    {
        user:{
            type: mongoose.ObjectId,
            ref: "User",
        },
        shortId: {
            type: String,
            required: true,
            unique: true
        },
        redirectUrl: {
            type: String,
            required: true
        },
        clickHistory: [
            {timestamp:{type: Number}}
        ]

    },
    { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
