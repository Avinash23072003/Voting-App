const mongoose = require('mongoose');
// const utcTime = "2024-08-24T19:03:59.020+00:00";
// const dateObj = new Date(utcTime);
// const istOffset = 5.5 * 60 * 60 * 1000;
// const istDate = new Date(dateObj.getTime() + istOffset);
// User Schema for creating table
const CandidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true
    },
    Votes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true,
            },
            votedAt: {
                type: Date,
                default: function() {
                    // Current UTC date
                    const utcDate = new Date();
        
                    // Calculate IST offset (5 hours 30 minutes ahead of UTC)
                    const istOffset = 5.5 * 60 * 60 * 1000; // milliseconds
        
                    // Convert UTC to IST
                    const istDate = new Date(utcDate.getTime("  ") + istOffset);
        
                    // Return the IST Date object
                    return istDate;
                }
            }
            
            }

    ],
    voteCount:{
        type:Number,
        default:0,
    }
   
});



const Candidate = mongoose.model('Candidate', CandidateSchema );
module.exports = Candidate;
