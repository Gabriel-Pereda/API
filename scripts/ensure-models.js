const path = require('path');
const fs = require('fs-extra');

// Define models content
const userModel = `
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
`;

// Ensure directories and files exist
async function ensureModels() {
  try {
    const rootDir = path.resolve(__dirname, '..');
    const modelsDir = path.join(rootDir, 'src', 'models');
    
    // Create models directory if it doesn't exist
    await fs.ensureDir(modelsDir);
    
    // Write User.js if it doesn't exist
    const userModelPath = path.join(modelsDir, 'User.js');
    if (!fs.existsSync(userModelPath)) {
      await fs.writeFile(userModelPath, userModel);
      console.log('✅ Created User.js model');
    }

    console.log('✅ Models setup complete');
  } catch (error) {
    console.error('❌ Error setting up models:', error);
    process.exit(1);
  }
}

ensureModels();