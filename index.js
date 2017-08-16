var express = require('express');
var app = express();
var port = 3700;


app.set('views',__dirname + '/views');  //模板路径
app.set('view engine','jade');  //jade引擎
app.engine('jade',require('jade').__express);   //引入jade
app.get('/',function(req,res){      //URL渲染
    res.render('page');
});



app.use(express.static(__dirname +'/public'));
var io = require('socket.io').listen(app.listen(port));
io.sockets.on('connection',function(socket){
    socket.emit('message',{message:'welcome to the chat app'})
    socket.on('send',function(data){
        io.sockets.emit('message',data);
    })
});
