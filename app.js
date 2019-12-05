const express = require('express');
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const DB =  require('./MongoDB.js').DB; 
const PORT = 4000
const URI = 'mongodb://localhost:27017/social_media'
// const URI= 'mongodb+srv://coldblood101:Dragon1774@mastercluster-lhsxk.azure.mongodb.net/onlineexam?retryWrites=true&w=majority'
// const URI = 'mongodb://localhost:27017/test'

DB.connect(URI);
const app =express()

app.set('views',__dirname+'/public/views');
app.use(express.static('public/'))
app.set('view engine','ejs');

// add & configure middleware

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  store: new FileStore(),
  secret: 'keyboard cat',
  saveUninitialized: true
}))

app.use(fileUpload({
    createParentPath: true
}));

app.get('/',(req,res)=>{
	if(req.session.isAuthenticated){
		res.redirect('home');
	}
	else
		res.redirect('/signup')
})

app.post('/login', async (req,res)=>{
	if(!req.session.isAuthenticated)
	{
		
		let user = req.body.user;
		const username_exist = await DB.CheckUsername(user.username).exec() ===1 ? true: false;
		if(!username_exist){
			// the account or user name is not exist 
			res.render('login',{user:{username: user.username}});
			req.session.isAuthenticated =  false;
		}
		const user_data =await DB.getUserByAccount(user.username,user.password).exec();
		if(!user_data){
			//return err
			// the password is wrong 
			res.redirect('/login')
			// res.render('login',{user:{username: user.username}});
			res.end();
		}
		else{
			console.log('saved');
			
			req.session.user = user_data;
			req.session.isAuthenticated = true;
			res.redirect('/home')
		}
	}else{
		console.log('user autheni')
		res.redirect('/home')
	}
})

app.get('/login',(req,res)=>{
	if(req.session.user)
		console.log(req.session.user)
	if(req.session.isAuthenticated)
		console.log(req.session.isAuthenticated)
	if(req.session.user&& req.session.isAuthenticated){
		res.redirect('/home')
	}
	else{
		if(req.session.user){
			res.render('login',{user:{username:req.session.user.username}});
		}else
			res.render('login',{user:{username:''}});
	}
})

app.get('/signup',(req,res)=>{
	if(req.session.isAuthenticated){
		res.redirect('/home')
	}
	else{
		res.render('signup');	
	}
})

app.post('/signup',async (req,res)=>{
	//post check required
	let user = req.body.user
	console.log(user);
	const username_exist = await DB.CheckUsername(user.username).exec() ===1;
	if(username_exist){
		console.log('user')
		// render err msg 
		res.redirect('/signup')
		res.end()
	}
	const email_exist = await DB.checkEmail(user.email).exec() !=0;
	console.log(email_exist)
	if(email_exist){
		console.log('email')
		//consolr log err mess email exist 
		res.redirect('signup')
		res.end()
		return;
	}else{
		DB.InsertUser(user);
		res.redirect('/login')
		res.end()
	}
})


app.get('/logout',(req,res)=>{
	req.session.destroy();
	res.redirect('/signup');
})


app.get('/home',async (req,res)=>{
	if(req.session.isAuthenticated&&req.session.user){
		// res.send('LOGGEDIN');
		let user =req.session.user;
		const user_data =await DB.getUserByAccount(user.username,user.password).exec();
		const news = await DB.getNewByUser(user._id);
		req.session.user = user_data;
		res.render('home',{user:req.session.user,news:news})
		res.end();
	}
	else
		res.redirect('/login')
})

app.post('/add_news',(req,res)=>{
	if(req.session.isAuthenticated && req.session.user){
		let news = req.body.news;
		news.owner={}
		news.owner._id=req.session.user._id;
		news.owner.name=req.session.user.name;
		news.owner.profile_image_link=req.session.user.profile_image_link;
		DB.insertNew(news);
		res.redirect('/home');
		
	}else{
		res.redirect('/login')
	}
})


app.get('/newsfeed',async (req,res)=>{
	if(req.session.isAuthenticated && req.session.user){
		let user = req.session.user;
		const user_data =await DB.getUserByAccount(user.username,user.password).exec();
		const user_news =await( DB.getNewByUser(user._id));
		const friends_news = await DB.getNewByFriends(user.friends);
		let news = user_news.concat(friends_news)
		res.render('newsfeed',{user:req.session.user,news:news})
		res.end()
	}else{
		res.redirect('/login');
	}
})

app.post('/search_user',async (req,res)=>{
	name=req.body.user.name;

	if(req.session.isAuthenticated && req.session.user){
		let user = req.session.user;

		const users = await DB.getUserByName(name).exec();
		const user_data =await DB.getUserByAccount(user.username,user.password).exec();
		res.render('user_display',{user:req.session.user,users:users})
		res.end()
	}else{
		res.redirect('/login');
	}
})

app.get('/messager',(req,res)=>{
	if(req.session.isAuthenticated && req.session.user){
		let user = req.session.user;
		res.render('messager')
	}else{
		res.redirect('/login');
	}
})

app.get('/fileuploads',(req,res)=>{
	res.render('file_view');
})

app.post('/fileuploads',(req,res)=>{
	console.log(req.files)
})

app.listen(PORT,(err)=>{
	console.log(`app.listen on port ${PORT}`)
})