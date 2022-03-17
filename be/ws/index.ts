import { Server } from "socket.io";
import { Rooms, UserRooms } from "models";
import server from '../server'
import {verify} from 'jsonwebtoken'
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const rooms : {[key : string] : any}= {};
io.use((socket , next) => {
    const { token } = socket.handshake.auth
    if (!token) return socket.disconnect()
    try {
        const payload : any = verify(token, global.Config.JWT)
        const _id = payload._id
        socket.data = {_id}
        socket.join(_id + '')
    } catch (error) {
        socket.disconnect()
        return
    }
    next()
})
io.on('connection', (socket) => {
    socket.on('join-room' ,async roomID => {
        socket.data.room = roomID
        const findRoom = await Rooms.findById(socket.data.room)
        if(!findRoom) return
        io.in(findRoom.owner + '').emit('customer-join')
        // const userRoom = await UserRooms.create({room : roomID._id , user : socket.data._id})

    })
    socket.on('join room', roomID => {
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }
        for (let index = 0; index < rooms[roomID].length; index++) {
            const otherUser = rooms[roomID][index];
            if(otherUser !== socket.id){
                socket.emit("other user", otherUser);
                socket.to(otherUser).emit("user joined", socket.id);
            }
        }
    })

    // socket.on('disconnect' , () => {
    //     if(rooms[room]) {
    //         const index = rooms[room].findIndex((o : any) => o === socket.id)
    //         if(index !== -1) {
    //             rooms[room].splice(index, 1)
    //         }
    //     }
    // })

    socket.on('send-offer' ,async payload => {
        //caller - customer send offer to owner
        const findRoom = await Rooms.findById(socket.data.room)
        if(!findRoom) return
        //emit offer to owner
        io.in(findRoom.owner + '').emit('receive-offer' , {
            ...payload,
            sender : socket.data._id
            
        })
    })

    socket.on('send-answer' ,async payload => {
        //owner send answer to customer
        io.to(payload.target).emit("receive-answer", payload);
    })

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    socket.on("ice-candidate",async incoming => {
        const findRoom = await Rooms.findById(socket.data.room)
        if(!findRoom) return
        io.in(findRoom.owner + '').emit('ice-candidate' , incoming.candidate)
    });
})

export default io