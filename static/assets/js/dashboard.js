function getLoca(){
		if (navigator.geolocation) {
    		navigator.geolocation.getCurrentPosition((x)=>{
    			let long = x.coords.longitude;
    			let lat = x.coords.latitude;
    			$("#btnCapQuyen").css("display","none");
    			socket.emit("weather",{long:long,lat:lat});
    		});
  			
  		} 
  else { 
    console.log("Geolocation is not supported by this browser.");
  }
}
  


function showPosition(position) {
	let lat = position.coords.latitude;
	let long = position.coords.longitude;
	$("#btnCapQuyen").css("display","none");


}

$(document).ready(()=>{
	getLoca();
	socket.on("weather",(data)=>{
		$("#city-name").html(data.name);
		$("#temp").html(data.temp+" &#8451;");
		let url =`http://openweathermap.org/img/wn/${data.icon}@2x.png`
		$("#icon-weather").attr("src",url);
		$("#wind-speed").html(data.speed);
		$("#text-sr").html(data.sunrise);
		$("#text-ss").html(data.sunset);
	})
	$("#chat-box").hide();
	$("#chat").click(()=>{
		$("#chat-box").show(500);
	})
	$("#send").click(()=>{
		const data = $("#inp-chat").val();
		const name = $("#name_user").val();
		$("#inp-chat").val('');
		console.log(name);
		socket.emit("send-chat", {data: data,  name: name});
	})
	socket.on("rep-chat",(data)=>{
			$("#asd").append('<div class="text">'+data.name+': '+data.data+'</div>');
			$("#box-chat-show").scrollTop($("#box-chat-show")[0].scrollHeight);
		})
	const x =  $("#name_user").val();
	socket.emit("add_user",x);
	socket.on("add_success",(data)=>{
		$("#list_user").html('');
			data.forEach((r)=>{
			$("#list_user").append('<div class="user">'+r+'</div>')
		})
		
	})
	 $("#log-out").click(()=>{
        socket.emit('disconnect');
    })
})