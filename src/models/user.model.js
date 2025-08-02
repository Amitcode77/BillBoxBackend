const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        fullName: { type: String },
        phone: { type: String },
        passwordHash: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin","manager", "staff"],
            default: "staff"
        },
        permissions: [String]
    }, { timestamps: true });

/**
 * Virtual field: password (not stored in DB)
 */
UserSchema.virtual('password')
    .set(function (plainPassword) {
        this._password = plainPassword;
        this.passwordHash = bcrypt.hashSync(plainPassword, SALT_ROUNDS);
    })
    .get(function () {
        return this._password;
    });

/**
 * Method to compare password
 */
UserSchema.methods.isValidPassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = mongoose.model("User", UserSchema);
