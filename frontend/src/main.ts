import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

// 消息端口是成对创建的。 连接的一对消息端口
// 被称为通道。
const channel = new MessageChannel()

// port1 和 port2 之间唯一的不同是你如何使用它们。 消息
// 发送到port1 将被port2 接收，反之亦然。
const port1 = channel.port1
const port2 = channel.port2

// 允许在另一端还没有注册监听器的情况下就通过通道向其发送消息
// 消息将排队等待，直到一个监听器注册为止。
port2.postMessage({ answer: 42 })

port2.onmessage = (event) => {
    console.log(event.data);
}
// 这次我们通过 ipc 向主进程发送 port1 对象。 类似的，
// 我们也可以发送 MessagePorts 到其他 frames, 或发送到 Web Workers, 等.
require('electron').ipcRenderer.postMessage('port', null, [port1])

export function maximize() {
    console.log('maximize');
    port2.postMessage({ answer: 1 })
}

export function minimize() {
    console.log('minimize');
    port2.postMessage({ answer: 2 })
}

export function close() {
    console.log('close');
    port2.postMessage({ answer: 3 })
}


import axios from 'axios';

let socket = new WebSocket('ws://localhost:8080');
export function register() {
    axios.post('http://localhost:3000/register', {
      id: 666
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log(res);
    });
}

export function send() {
    socket.send('Hello Server');
    socket.onmessage = function(event) {
      console.log('Message from server ', event.data);
    };
}