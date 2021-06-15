function getLoca() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((x) => {
            let long = x.coords.longitude;
            let lat = x.coords.latitude;
            $("#btnCapQuyen").css("display", "none");
            socket.emit("weather", { long: long, lat: lat });
        });

    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}



function showPosition(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    $("#btnCapQuyen").css("display", "none");


}

function joinroom2(val) {
    $(".before").hide();
    $("#chat-box").show(500);
    $("#roomNow").text(`Room: ${val}`);
    $("#roomNow").val(val);
}

function joinroom(id) {
    $(".before").hide();
    $("#chat-box").show(500);
    let id1 = $(`#${id}`).text();
    $("#roomNow").text(`Room: ${id1}`);
    const username = $("#username").text();
    let roomname = id1;
    console.log('123'+roomname);
    // $("#listroom").text('');
    if (roomname != '') {
        let val = {
            username: username.trim(),
            roomname: roomname,
        }
        console.log(username);
        socket.emit("joinroom", val);
        socket.emit("updateMessage", roomname);

    }


}

$(document).ready(() => {
    getLoca();

    $(".before").hide();
    socket.on("weather", (data) => {
        $("#city-name").html(data.name);
        $("#temp").html(data.temp + " &#8451;");
        let url = `http://openweathermap.org/img/wn/${data.icon}@2x.png`
        $("#icon-weather").attr("src", url);
        $("#wind-speed").html(data.speed);
        $("#text-sr").html(data.sunrise);
        $("#text-ss").html(data.sunset);
    })
    $("#chat-box").hide();
    $("#chat").click(() => {
        $(".before").show();
        $("#chat-box").hide(500);
        socket.emit("updateroom");
    })
    $("#send").click(() => {
        const data = $("#inp-chat").val();
        const name = $("#name_user").text();
        const username = $("#username").text();
        console.log(username);
        const roomname = $("#roomNow").val();
        $("#inp-chat").val('');
        console.log(roomname);
        socket.emit("send-chat", { data: data, name: name, roomname: roomname });
        socket.emit("save_data", { data: data, username: username, roomname: roomname, name: name });
    })
    socket.on("clear",()=>{
    	$("#asd").html('');
    })
    socket.on("updateMessage",(data)=>{
        $("#asd").append('<div class="text">' + data.name + ': ' + data.data + '</div>');
        $("#box-chat-show").scrollTop($("#box-chat-show")[0].scrollHeight);
    })
    socket.on("rep-chat", (data) => {
        console.log(data);
        $("#asd").append('<div class="text">' + data.name + ': ' + data.data + '</div>');
        $("#box-chat-show").scrollTop($("#box-chat-show")[0].scrollHeight);
    })
    const x = $("#name_user").text();
    const y = $("#username").text();
    socket.emit("add_user", { username: y, name: x });
    socket.on("add_success", (data) => {
        $("#list_user").html('');
        data.forEach((r) => {
            $("#list_user").append('<div class="user">' + r + '</div>')
        })

    })
    $("#log-out").click(() => {
        socket.emit('logout');
    })
    $("#createroom").click(() => {
        const username = $("#username").text();
        let roomname = $("#Room_name").val();
        // $("#listroom").text('');
        if (roomname != '') {
            let val = {
                hostname: username,
                roomname: roomname,
                member: [username],
            }
            joinroom2(roomname);
            socket.emit("createroom", val);
        }


    });
    $("#joinroom").click(() => {
        const username = $("#username").text();
        let roomname = $("#Room_name").val();
        // $("#listroom").text('');
        if (roomname != '') {
            let val = {
                username: username,
                roomname: roomname,
            }
            joinroom2(roomname);
            socket.emit("joinroom", val);
            socket.emit("updateMessage", roomname);

        }


    });
    socket.on("roomlist", (data) => {
        $("#listroom").text('');
        if (data.length === 0) {
            let name = 'Khong co phong nao duoc tao';
            $("#listroom").append('<div id=' + name + '" >' + name + '</div>')
        }
        data.forEach((r) => {
            name = r.roomname;
            const html = '<div class="rooms" id=' + name + ' onclick="joinroom(this.id)" >' + name + '</div>'
            $("#listroom").append(html)
        })
    })
    $("#inp-chat").focusin(() => {
        const name = $("#name_user").text();
        let roomname = $("#Room_name").val();
        $("#type").show(1000);
        
        console.log(name,roomname);
        socket.emit('typing', { roomname:roomname , name:name});
        socket.on("typing",(data)=>{
        	const html2 = `<div style="position: absolute; bottom:10px;font-size: 20px;" id="typing">\
                        <img src="assets/img/typing.gif" id="typing-img" alt=""><span>  ${data} dang soan tin</span></div>`
            $("#type").html(html2);
        })
    
    })
    $("#inp-chat").focusout(()=>{
    		const name = $("#name_user").text();
        let roomname = $("#Room_name").val();        
        console.log(name,roomname);
        socket.emit('nonetyping', { roomname:roomname , name:name});
    		socket.on('nonetyping',()=>{
    		console.log('xinchaooo');
    		$("#type").html('');
    	})
    })  
     
})