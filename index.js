var express = require('express');
var app 	= express();
var http	= require('http').Server(app);
var io		= require('socket.io')(http);
var UUID	= require('node-uuid');
var fs		= require('fs');
var user	= {
	name: "",
	score: "",
	level: "",
	uid: ""
};
/*
	app.get('/', function(req, res){
	res.sendfile('index.html');
	});
*/
app.use(express.static("menu"));

io.on('connection', function(socket){
	socket.userid = UUID();
	socket.emit('onconnected', { id: socket.userid } );
	//console.log('a user connected');

	socket.on('disconnect', function(){
		//console.log('user disconnected');
	});

    socket.on('login', function(arr){
		//sync read json
		var oo={};
		var data=fs.readFileSync("menu/assets/users.json", "utf8");
		oo = JSON.parse(data);


		var hisScore=0;
		var hisLevel=0;
		var found=0;
		var x;
		for ( x in oo){
			if(oo[x].name==arr.name){
				hisScore=oo[x].score;
				hisLevel=oo[x].level;
				found=1;
			}
		}
		if(found==0){
			//add record to json
			//console.log("hellllo");
			oo.push({name:arr.name,score:0,level:0});
			data=JSON.stringify(oo);
			fs.writeFileSync("menu/assets/users.json",data, "utf8");
		}
		user['name']=arr.name;
		user['score']=hisScore;
		user['level']=hisLevel;
		user['uid']=arr.sendid;
		console.log(
		"name: "+user['name']+
		"\nscore: "+user['score']+
		"\nuid: "+user['uid']+
		"\nlevel: "+user['level']
		);
		io.emit('loginStatus', user);
	});

	socket.on('endgame', function(arr){//arr name, score, win
		//sync read json
		var oo={};
		var data=fs.readFileSync("menu/assets/users.json", "utf8");
		oo = JSON.parse(data);


		var hisScore=0;
		var hisLevel=0;
		var x;
		for ( x in oo){
			if(oo[x].name==arr.name){
				if(arr.score>oo[x].score)oo[x].score=arr.score;
				hisScore=oo[x].score;
				if(arr.win==1){
					oo[x].level=1;
				}
				hisLevel=oo[x].level;
			}
		}
		user['name']=arr.name;
		user['score']=hisScore;
		user['level']=hisLevel;
		user['uid']=arr.sendid;
		//data in json
		data=JSON.stringify(oo);
		fs.writeFileSync("menu/assets/users.json",data, "utf8");
	});

	socket.on('getUser',function(){
		//console.log("im here");
		socket.emit('getbackUser', user );
	});

});
http.listen(3000, function(){
	console.log('listening on *:3000');
});