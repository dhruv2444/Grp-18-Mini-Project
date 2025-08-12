const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure no duplicate users
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", function (next) {
  if (this.firstName) {
    this.firstName = this.firstName[0].toUpperCase() + this.firstName.slice(1).toLowerCase();
  }
  if (this.lastName) {
    this.lastName = this.lastName[0].toUpperCase() + this.lastName.slice(1).toLowerCase();
  }
  next();
});

const UserModel = model('User',UserSchema)

module.exports = UserModel
