class Client {
    constructor() {
    };

    init() {
        let that = this;
        this.socket = io.connect(); //连接服务器，创建套接字
        this.socket.on("connect", () => {
            //连接到服务器后，显示昵称输入框
            document.getElementById('info').textContent = '请输入您的昵称';
            document.getElementById('nickWrapper').style.display = 'block';
            document.getElementById('nicknameInput').focus();

            //提交昵称并登录
            let ensureFunc = () => {
                let nickName = document.getElementById('nicknameInput').value;
                //检查昵称输入框是否为空
                if (nickName.trim().length !== 0) {
                    //不为空，则发起一个login事件并将输入的昵称发送到服务器
                    that.socket.emit('login', nickName);
                } else {
                    //否则输入框获得焦点
                    document.getElementById('nicknameInput').focus();
                }
                ;
            }
            document.getElementById('loginBtn').addEventListener('click', ensureFunc, false);
            document.onkeydown = function (event) {
                var e = event || window.event;
                if (e && e.keyCode === 13) {
                    ensureFunc();
                }
            };
        })
        //登录失败
        this.socket.on('nickExisted', function () {
            document.getElementById('info').textContent = '该昵称已被占用'; //显示昵称被占用的提示
        });
        //登录成功
        this.socket.on('loginSuccess', function () {
            document.title = 'Chatroom | ' + document.getElementById('nicknameInput').value;
            document.getElementById('loginWrapper').style.display = 'none';//隐藏遮罩层显聊天界面
            document.getElementById('messageInput').focus();//让消息输入框获得焦点


            //发送消息
            let sendMsgFunc = () => {
                let msgInput = document.getElementById('messageInput'),
                    msg = msgInput.value;
                //检查昵称输入框是否为空
                if (msg.trim().length !== 0) {
                    that.socket.emit("postMsg", msg);
                    that._displayNewMsg("me", msg);
                }
                msgInput.value = "";
                msgInput.focus();
            };
            document.getElementById('sendBtn').addEventListener('click', sendMsgFunc, false);
            //监听回车
            document.onkeydown = function (event) {
                var e = event || window.event;
                if (e && e.keyCode === 13) { //回车键的键值为13
                    sendMsgFunc(); //调用登录按钮的登录事件
                }
            };
        });
        //接收全局消息
        this.socket.on('systemMsg', (nickName, onlineNumbers, type) => {
            document.getElementById('status').textContent = onlineNumbers + (onlineNumbers > 1 ? "users are" : "user is") + 'online';
            let msg = nickName + (type === 'login' ? "  joined !" : "  left !");
            that._displayNewMsg('系统消息 ', msg, 'red');
        });
        //接收新消息
        this.socket.on('newMsg', (user, msg) => {
            that._displayNewMsg(user, msg);
        });

    }

    //展示新消息
    _displayNewMsg(user, msg, color) {
        let msg_box = document.getElementById("historyMsg"),
            date = new Date().toLocaleTimeString(),
            p = document.createElement('p');
        p.style.color = color || "333333";
        p.innerHTML = user + "<span class='timespan'>( " + date + " )</span>" + " : " + msg;
        if (user === 'me') {
            let div = document.createElement("div");
            p.style.float = "right";
            div.style.overflow = "hidden";
            div.appendChild(p);
            msg_box.appendChild(div);
        } else {
            msg_box.appendChild(p);
        }
    }
}

window.onload = function () {
    let client = new Client();
    client.init();
};


