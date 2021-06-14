let lon = "105.76367199999999";
let lat = "10.023898999999998";
const api_key = "ce86fa1d45f983171c0b9a235b6a4a22";
let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
global.l = ''
axios.get(url).then(response =>{
	let data = response.data;
	weather = data.weather;
	weather.forEach(r=>{
		 l = r.icon;
	})

	temp = data.main.temp;
	speed= data.wind.speed;
	sunrise = data.sys.sunrise;
	sunset = data.sys.sunset;
	name = data.name;
	time_sunrise = new Date(sunrise*1000);
	time_sunset = new Date(sunset*1000);
	hour_rise = time_sunrise.getHours();
	hour_set = time_sunset.getHours();
	minutes_rise = time_sunrise.getMinutes();
	minutes_set = time_sunset.getMinutes();
	time_rise = hour_rise + ":" + minutes_rise;
	time_set = `${hour_set}:${minutes_set}`
	const x = {
		name:name,
		speed:(speed * 3.6).toFixed(2),
		temp: temp - 273.15,
		sunrise: time_rise,
		sunset : time_set,
		icon: l,

	}	
	console.log(x);
	
})
