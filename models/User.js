import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address'
            ]
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false // Don't return password by default
        },
        avatar: {
            type: String,
            default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
        },
        role: {
            type: String,
            enum: ['Player', 'Pro Player', 'Analyst', 'Fan', 'Admin'],
            default: 'Player'
        },
        joinedDate: {
            type: String,
            default: () => new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        },
        favoriteGames: {
            type: [String],
            default: []
        },
        followedTeams: {
            type: [String],
            default: []
        },
        followedPlayers: {
            type: [String],
            default: []
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        lastLogin: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt
    }
);

// Hash password before saving
userSchema.pre('save', async function () {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        avatar: this.avatar,
        role: this.role,
        joinedDate: this.joinedDate,
        favoriteGames: this.favoriteGames,
        followedTeams: this.followedTeams,
        followedPlayers: this.followedPlayers,
        createdAt: this.createdAt
    };
};

const User = mongoose.model('User', userSchema);

export default User;
