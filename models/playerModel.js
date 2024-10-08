import mongoose from "mongoose";

const sportsEnum = {
    student: ['football', 'basketball', 'cricket', 'volleyball', 'athletics','table-tennis','badminton'],
    faculty: ['badminton', 'cricket', 'volleyball', 'athletics','table-tennis']
};

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You must enter the name']
    },
    id: {
        type: String,
        required: [true, 'You must enter your institute ID'],
        unique: true 
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique:true

    },
    attendance: {
        type: Map,
        of: [String],
        default: {}
    },
    type: [{
        type: String,
        enum: ['student', 'faculty', 'student-coordinator', 'faculty-coordinator', 'student-secretary', 'faculty-secretary'],
        required: true,
        default:['student']
    }],
    sport: [{
        type: String,
        required: [true, 'You are not assigned with any sport'],
        validate: {
            validator: function(value) {
                let validSports = [];

                // Check player's type to determine valid sports for the sport field
                if (this.type.includes('student') || this.type.includes('student-coordinator') || this.type.includes('student-secretary')) {
                    validSports = sportsEnum.student; // Get student sports
                } else if (this.type.includes('faculty') || this.type.includes('faculty-coordinator') || this.type.includes('faculty-secretary')) {
                    validSports = sportsEnum.faculty; // Get faculty sports
                }

                // Validate each sport in sport against validSports
                if (Array.isArray(value)) {
                    return value.every(sport => validSports.includes(sport)); // Validate all sports
                } else {
                    return validSports.includes(value); // If not an array, validate single value
                }
            },
            message: props => `${props.value} is not a valid sport for this role.`
        },
        enum: [...sportsEnum.student, ...sportsEnum.faculty] // Include all sports as a valid enum for initial validation
    }],
    coordinatorFor: [{
        type: String,
        validate: {
            validator: function(value) {
                let validSports = [];

                // Check player's type to determine valid sports for coordinator
                if (this.type.includes('student') || this.type.includes('student-coordinator') || this.type.includes('student-secretary')) {
                    validSports = sportsEnum.student; // Get student sports
                } else if (this.type.includes('faculty') || this.type.includes('faculty-coordinator') || this.type.includes('faculty-secretary')) {
                    validSports = sportsEnum.faculty; // Get faculty sports
                }

                // Validate each sport in coordinatorFor against validSports
                if (Array.isArray(value)) {
                    return value.every(sport => validSports.includes(sport)); // Validate all sports
                } else {
                    return validSports.includes(value); // If not an array, validate single value
                }
            },
            message: props => `${props.value} is not a valid sport for the coordinator role.`
        }
    }]
});

// Automatically set all sports as coordinated if player is a secretary
playerSchema.pre('save', function(next) {
    if (this.type.includes('student-secretary')) {
        this.coordinatorFor = sportsEnum.student; // Assign all student sports
    } else if (this.type.includes('faculty-secretary')) {
        this.coordinatorFor = sportsEnum.faculty; // Assign all faculty sports
    }
    next();
});

const Player = mongoose.model('Player', playerSchema);

export default Player;
