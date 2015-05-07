var taskModel = require('./models/todoModel');
var userModel = require('./models/userModel');

var usernamelocal;

function getTodos(res){
	taskModel.find({username: usernamelocal , completed: false},function(err,docs){
			if (err)
				res.send(err)
			res.json(todos); 
		});
};

module.exports = function(app,passport) {

	app.get('/todolist',function(req,res){
		taskModel.find({username: usernamelocal , completed: false},function(err,docs){
			res.json(docs);
		});
		
	});
app.get('/listcopleted',function(req,res){
		taskModel.find({username: usernamelocal , completed: true},function(err,docs){
			res.json(docs);
		});
		
	});

	app.post('/addnewtask',function(req,res){
		var day= new Date(req.body.date);
		var createday=new Date();
		var atask = new taskModel({username: usernamelocal, task: req.body.task, date: day, completed: false});
		console.log(atask);
		atask.save(function(err,doc){
			if(err) return console.error(err);
			res.send();//send for client success
		});
	});

	app.delete('/deletetask/:id',function(req,res){
		console.log(req.params.id);
		taskModel.remove({_id: req.params.id, username: usernamelocal},function(err,docs){
			res.send();
		});
	});

	app.delete('/deletetaskcpted/:id',function(req,res){
		console.log(req.params.id);
		taskModel.remove({_id: req.params.id, username: usernamelocal},function(err,docs){
			res.send();
		});
	});

	app.get('/done/:id',function(req,res){
		var id = req.params.id;
		var createday=new Date();
		console.log(id);
		taskModel.update({_id: id, username: usernamelocal},{$set: {completed: true,dateinfo: {CompleteTime: createday}}},function(err,docs){
			res.send();
		});
	});

	app.get('/alldone',function(req,res){
		var createday=new Date();
		taskModel.update({username: usernamelocal},{$set: {completed: true,dateinfo: {CompleteTime: createday}}},{multi: true},function(err,docs){
			res.send();
		});
	});

	app.get('/edittask/:id',function(req,res){
		var id =req.params.id;
		taskModel.findOne({_id: id, username: usernamelocal},function(err,doc){
			res.json(doc);
		});
	});

	app.put('/updatetask/:id',function(req,res){
		var id=req.params.id;
		console.log(id);
		var tasks=req.body;
		var createday=new Date();
		taskModel.update({_id: id, username: usernamelocal},{$set:{task: tasks.task,dateinfo:{CreateTime: createday}}},function(err,doc){
			res.send();
		});
	});


	app.get('/loggedin', function(req, res) {
  		res.send(req.isAuthenticated() ? req.user : '0');
	});
	app.post('/login', passport.authenticate('local'), function(req, res) {
		console.log(req.user.name);
		usernamelocal=req.user.name;
 		res.send(req.user);
	});

// route to log out
	app.post('/logout', function(req, res){
 	 	req.logOut();
 		res.send(200);
	});

	app.post('/register',function(req,res){
		userModel.findOne({username: req.body.username},function(err,user){
			if(user!=null){
				console.log(user);
				res.json({status: 0});
			}else{
				var auser = new userModel({username: req.body.username, password: req.body.password, email: req.body.email});
     			 auser.save(function(err,doc){
     			 if(err) return console.error(err);
       			 res.json({status: 1});//send for client success
   				 });
   				
			}
		});
	
	});
}