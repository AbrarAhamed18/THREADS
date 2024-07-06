import {Server} from 'socket.io'
import http from 'http';
import express from 'express'

import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';



const app = express()
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://127.0.0.1:5000",
        methods:["GET","POST"]
    }
})

const userSocketMap = {} //userId: sockeyId
export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId]
}


io.on('connection',(socket)=>{
    console.log("user Connected",socket.id)
    const userId = socket.handshake.query.userId;
    if(userId !== "undefined") userSocketMap[userId] = socket.id
    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("markMessagesAsSeen",async({conversationId,userId})=>{
        try {
            await Message.updateMany({converSationId:conversationId,seen:false},{$set:{seen:true}})
            await Conversation.updateOne({_id:conversationId},{$set:{"lastMessage.seen":true}})
            io.to(userSocketMap[userId]).emit("messagesSeen",{conversationId})
            
        } catch (error) {
            console.log(error)
            
        }
    })
    
    socket.on("disconnect",()=>{
        console.log("user disconnected")
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))

    })
})

export{io,server,app}

