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

})