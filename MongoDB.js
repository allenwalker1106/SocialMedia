const mongoose = require('mongoose')
const User = require('./models/User.js')
const New = require('./models/New.js')
// const URI= 'mongodb+srv://coldblood101:Dragon1774@mastercluster-lhsxk.azure.mongodb.net/onlineexam?retryWrites=true&w=majority'
// const URI = "mongodb://localhost:27017/test"

function connect(URI){
    mongoose.connect(URI,{useNewUrlParser:true,useUnifiedTopology: true},(err,res)=>{
        if(err) throw err
        console.log('Connect Succesful')
    })
}
//user DB function
function getUserById(_id){
    let query = {_id: _id};
    return User.findOne(query);
}

function getUsersById(_ids){
    let query = {_id:{$id:_ids}};
    return User.find(query, { projection: { password:0,username:0,address:0,courses:0, tests:0, question: 0,links:0, files:0 } });
}

function getUserByAccount(username,password){
    let query ={
        username: username,
        password: password
    }
    return User.findOne(query);
}

function InsertUser(user){
    //authenzied the user and add the user tp databases 
    let userObject = new User(user);
    userObject.save((err,res)=>{
        if(err) throw err;
        console.log(res);
        console.log('create success ');
    })
}

function CheckUsername(username){
    let query = {username: username}
    return User.findOne(query).countDocuments()
}

function checkEmail(email){
    let query={email: email}
    return User.findOne(query).countDocuments();
}
//user DB function


function  updateUserById(_id,_qid){
    User.updateOne({_id: _id},{$push:{questions:_qid}},(err,res)=>{
        console.log("Update successful");
    });
}

function insertNew(news){
    let newsObject = new New(news);
    newsObject.save((err,res)=>{
        if(err) {
            console.log('insert News',err);
            throw err;
        }
        else
            console.log('add news success')
    })
}

function getUserByName(name){
    name = name.trim()
    var res = name.split(" ");
    let st1 = res[0]
    let st2 = res[res.length-1]
    return User.find({$or:[{"name.firstname":st1},{"name.firstname":st2},{"name.lastname":st1},{"name.lastname":st2}]}, { password:0,username:0,address:0,courses:0, tests:0, question: 0,links:0, files:0 });
}

function getNewByIds(ids){
    return New.find({_id:{$in:ids}}).sort({create_date:-1})
}

function getNewByFriends(ids){
    return New.find({"owner._id":{$in:ids}}).sort({create_date:-1})
}

function getNewByUser(id){
    return New.find({"owner._id":id}).sort({create_date:-1});
}



exports.DB={
    connect: connect,

    getUserById:getUserById,
    getUserByAccount:getUserByAccount,
    InsertUser:InsertUser,
    getUsersById: getUsersById,
    CheckUsername:CheckUsername,
    checkEmail:checkEmail,
    updateUserById:updateUserById,
    getUserByName:getUserByName,

    insertNew:insertNew,
    getNewByIds:getNewByIds,
    getNewByUser:getNewByUser,
    getNewByFriends:getNewByFriends,


}