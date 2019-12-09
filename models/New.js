const mongoose = require('mongoose')
const news_schema = new mongoose.Schema({
    owner:{
        _id:mongoose.Schema.ObjectId,
        name:{
            firstname:String,
            middlename:String,
            lastname:String
        },
        profile_image_link:String
    },
    group:{
        type:mongoose.Schema.ObjectId
    },
    body:{
        type:String,
        default: ""
    },
    media:{
        type:Object,
        default: undefined
    },
    create_date:{
        type: Date,
        required: true,
        default: Date.now
    },
    modified_date:{
        type:Date,
        required: true,
        default: Date.now
    },
    likes:[
        {
            _id:mongoose.Schema.ObjectId,
            name:{
                firstname:String,
                middlename:String,
                lastname:String
            },
            profile_image_link:String
        }
    ],
    comments:[
        {
            create_date:{
                type:Date,
                default:Date.now,
                required: true
            },
            owner:{
                _id:mongoose.Schema.ObjectId,
                name:{
                    firstname:String,
                    middlename:String,
                    lastname:String
                },
                profile_image_link:String
            },
            body:{
                type:String
            },
            image_link:{
                type:String,
                default:""
            } 
        }
    ],
    shares:{
        type:Number,
        default:0
    }
})


module.exports = mongoose.model('New',news_schema,'news')