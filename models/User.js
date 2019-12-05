const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        firstname: {
            type: String,
            required: true,
            lowercase: false,
            min:6

        },
        middlename:{
            type:String,
            default:"",
            required: false,
        },
        lastname:{
            type: String,
            required: true,
            lowercase : false,
            min:6
        }
    },
    username:{
        type: String,
        required: true,
        lowercase: true,
        min: 6,
        max: 255
    },
    password:{
        type: String,
        required: true,
        min:6,
        max: 1024
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
    },
    date_of_birth:{
        type: Date,
        required: true,
    },
    gender:{
        type:String,
        required: true,
        default:"other"
    },
    profile_image_link:{
        type: String,
        default: "data/image/default_avata.png"
    },
    background_image_link:{

        type: String,
        default: "data/image/default_background.png"
    },
    description:{
        type:String,
        default: ""
    },
    address:{
        city:{
            type: String,
            default :""
        },
        country:{
            type: String,
            required: true,
        }

    },
    side_info:[
        {
            type:String,
            default:""
        }
    ],
    medias:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Files',
        }
    ],
    friends:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        }
    ],
    followers:{
        type: Number,
        default:0
    }

})


module.exports = mongoose.model('User',userSchema,"users");