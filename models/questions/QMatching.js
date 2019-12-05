const mongoose = required('mongoose');

const questionSchema = new mongoose.Schema({
	type:{
		type:String,
		required: true,
		default:"matching"
	},
	topic:{
		type:String,
		required:true,
		default:'general'
	},
	owner:{
		type:mongoose.Schema.ObjectId,
		ref:'Users'
	},
	body:{
		type:String,
		required: true,
	},
	imported:[{
		type:mongoose.Schema.ObjectId,
	}],
	options:{
		head:{
			type:Array,
			default:[],
			required: true
		},
		tail:{
			type:Array,
			default:[],
			required: true
		}
	},
	result:[
		{
			head:{
				type:String,
				required:true,
				lowercase: true
			},
			tail:{
				type:String,
				required:true,
				lowercase: true
			}
		}
	],
	create_date :{
		type: Date,
		required: true,
		default : Date.now
	},
	modified_date:{
		type: Date,
		required: true,
		default: Date.now
	}
})


module.exports = mongoose.model('QMatching',questionSchema,'questions');