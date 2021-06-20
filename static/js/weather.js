const getLoca = () => {
    if (navigator.geolocation) {
        return new Promise(resolve => {
            navigator.geolocation.getCurrentPosition(x => {
                let lon = x.coords.longitude;
                let lat = x.coords.latitude;
                resolve({ lon, lat });
            })
        })

    }



}
async function getData() {
    try {
        const api_key = "ce86fa1d45f983171c0b9a235b6a4a22";
        const { lon, lat } = await getLoca();
        let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
        let response = await axios.get(url);
        let data = response.data;
        weather = data.weather;
        weather.forEach(r => {
            l = r.icon;
        })
        temp = data.main.temp;
        speed = data.wind.speed;
        sunrise = data.sys.sunrise;
        sunset = data.sys.sunset;
        name = data.name;
        time_sunrise = new Date(sunrise * 1000);
        time_sunset = new Date(sunset * 1000);
        hour_rise = time_sunrise.getHours();
        hour_set = time_sunset.getHours();
        minutes_rise = time_sunrise.getMinutes();
        minutes_set = time_sunset.getMinutes();
        time_rise = hour_rise + ":" + minutes_rise;
        time_set = `${hour_set}:${minutes_set}`
        const x = {
            name: name,
            speed: (speed * 3.6).toFixed(2),
            temp: (temp - 273.15).toFixed(2),
            sunrise: time_rise,
            sunset: time_set,
            icon: l,

        }
        return x;
    } catch (err) {
        console.log(err);
    }



    //     axios.get(url).then(response => {
    //         let data = response.data;
    //         weather = data.weather;
    //         weather.forEach(r => {
    //             l = r.icon;
    //         })
    //         temp = data.main.temp;
    //         speed = data.wind.speed;
    //         sunrise = data.sys.sunrise;
    //         sunset = data.sys.sunset;
    //         name = data.name;
    //         time_sunrise = new Date(sunrise * 1000);
    //         time_sunset = new Date(sunset * 1000);
    //         hour_rise = time_sunrise.getHours();
    //         hour_set = time_sunset.getHours();
    //         minutes_rise = time_sunrise.getMinutes();
    //         minutes_set = time_sunset.getMinutes();
    //         time_rise = hour_rise + ":" + minutes_rise;
    //         time_set = `${hour_set}:${minutes_set}`
    //         const x = {
    //             name: name,
    //             speed: (speed * 3.6).toFixed(2),
    //             temp: (temp - 273.15).toFixed(2),
    //             sunrise: time_rise,
    //             sunset: time_set,
    //             icon: l,

    //         }
    //         console.log(x);
    //         return x;
    // })
};

$(document).ready(async () => {
    const data = await getData();
    $("#city-name").html(data.name);
    $("#temp").html(data.temp + " &#8451;");
    let url = `http://openweathermap.org/img/wn/${data.icon}@2x.png`
    $("#icon-weather").attr("src", url);
    $("#wind-speed").html(data.speed);
    $("#text-sr").html(data.sunrise);
    $("#text-ss").html(data.sunset);
});