const getHash = require('../hashpassword/hash');
const Rooms = require('../models/rooms');
const Chat = require('../models/chat');
module.exports = {
    createRoom: async (req, res) => {
        if (req.session.isAuthenticated) {
            const { username, roomname } = req.body;
            if (!username || !roomname) res.send('Vui long nhap ten phong');
            else {
                const newRoom = await new Rooms({
                    hostname: username.trim(),
                    roomname,
                })
                await newRoom.save();
                return res.send('asdasd');
            }
        } else {
            res.redirect('/login');
        }

    },
    joinRoom: async (req, res) => {
        if (req.session.isAuthenticated) {
            const roomname = req.params.roomname;
            const username = req.session.authUser.username;
            if (!roomname) res.status(404);
            else {
                let room = await Rooms.findOne({ roomname });
                await Rooms.findOneAndUpdate({roomname}, {
                    $addToSet: {
                        member: username,
                    }
                })
                inRoom = room._id;
                const chat = await Chat.find({ inRoom })
                if (chat.length == 0) {
                    const chat = await new Chat({
                        owner: username,
                        inRoom
                    })
                    await chat.save()
                }
                room = await Rooms.findOne({roomname});
                const member = room.member;
                res.render('chat', { data: req.session.authUser, roomname: req.params.roomname,member});

            }
        } else {
            res.redirect('/login');

        }
    }


}