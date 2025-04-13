const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'company', 'admin'],
      default: 'student',
    },
    firstName: {
      type: String,
      required: function() {
        return this.role === 'student' || this.role === 'admin';
      },
      trim: true,
    },
    lastName: {
      type: String,
      required: function() {
        return this.role === 'student' || this.role === 'admin';
      },
      trim: true,
    },
    companyName: {
      type: String,
      required: function() {
        return this.role === 'company';
      },
      trim: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
