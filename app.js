const express = require('express'), //引入express模块
    app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use('/', express.static(__dirname + '/resource')); //指定静态HTML文件的位置
server.listen(80);
console.log('server started');

let users = [];
//接收套接字
io.on("connection", (socket) => {
    //处理login事件
    socket.on("login", (nickName) => {
        //判断登录是否成功
        if (users.indexOf(nickName) > -1) {
            socket.emit("nickExisted");
        } else {
            socket.userIndex = users.length;
            socket.nickName = nickName;
            users.push(nickName);
            socket.emit("loginSuccess");
            io.sockets.emit("systemMsg", socket.nickName, users.length, "login");
        }
    })

    //断开连接，删除用户
    socket.on("disconnect",(socket)=>{
        users.splice(socket.userIndex,1);
        io.emit("systemMsg",socket.nickName,users.length,"logout");
    })


    //接收新消息
    socket.on('postMsg', (msg)=>{
        //将消息发送到除自己外的所有用户
        socket.broadcast.emit('newMsg', socket.nickName, msg);
    });
})

