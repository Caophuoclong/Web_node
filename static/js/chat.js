$(document).ready(()=>{
	const room = $("#roomNow").text().trim();
	socket.emit('joinroom',room);
	const username = $("#username").text().trim();
	$("#send").click(()=>{
		const message = $("#inp-chat").val();
		const html = '<div class="message sender"><span id="text-sender">'+ message+ '</span></div>'
		$("#box-chat-show").append(html);
		$("#inp-chat").val('');
		socket.emit('send',{username, message, room});
	})
	$("#inp-chat").keypress((e)=>{
		if(e.which == 13){
			const message = $("#inp-chat").val();
			const html = '<div class="message sender" ><span id="text-sender">'+ message+ '</span></div>'
			socket.emit('send',{username, message, room});
			$("#box-chat-show").append(html);
			$("#inp-chat").val('');
		}
	})
	socket.on('reply',data=>{
		const html =  '<div class="message reciver" ><span class="text-reciver"><span>'+data.username+': </span>'+data.message+'</span></div>'
		$("#box-chat-show").append(html);
	})
	socket.on('join-success',data=>{
		console.log(data);
		for (i in data){
			if(data[i].owner != username){
			const reciver =  '<div class="message reciver" ><span class="text-reciver"><span>'+data[i].owner+': </span>'+data[i].text+'</span></div>'

			$("#box-chat-show").append(reciver);

		}
		else{
			const sender = '<div class="message sender"><span id="text-sender">'+ data[i].text+ '</span></div>'
			$("#box-chat-show").append(sender);

		}
		}
		

	})
	
})