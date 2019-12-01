// defining some varibles
const API_KEY = "a5907854903dbd59fb4539ee981dadf2"
const timezone_apikey = "4Q1KLNX98GSZ"
let city_name = document.getElementById("city_name")
let search = document.getElementById("search")
let temp_description = document.querySelector(`.temp-description`)
let date_time = document.querySelector(`.date-time`)
let temp_num = document.getElementById("temp-num")
let timezone = document.querySelector(`.location-timezone`)
let humi_value = document.querySelector(".humi-value")
let wind_value = document.querySelector(".wind-value")
let cloud_value = document.querySelector(".cloud-value")
let pres_value = document.querySelector(".pres-value")
let data
let time_data
let cel = false

//  function to convert farenhiet to celsius

function displayTemp(f, c) {
    if (c) return Math.floor((f - 32) * (5 / 9)) + "&deg;C"
    return Math.floor(f) + "&deg;F"
}

// function to update  weather informations
function render(data, cel) {
    timezone.textContent = data.name
    temp_num.innerHTML = displayTemp(data.main.temp, cel)
    temp_description.textContent = data.weather[0].description
    humi_value.innerHTML = data.main.humidity + "&nbsp;" + "%"
    wind_value.innerHTML = data.wind.speed + "&nbsp;" + "mph"
    cloud_value.innerHTML = data.clouds.all + "&nbsp;" + "%"
    pres_value.innerHTML = data.main.pressure + "&nbsp;" + "hPa"
    let high = displayTemp(data.main.temp_max, cel)
    let low = displayTemp(data.main.temp_min, cel)
    let icon = data.weather[0].icon
    let iconSrc = "http://openweathermap.org/img/wn/" + icon + ".png"
    $(".high-low").html(high + "/" + low)
    $("#icon").prepend('<img class="icon-img" src=' + iconSrc + '>')
}

//Check for Geoloaction support 

window.addEventListener("load", () => {
    let long
    let lat

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            // console.log(position)
            long = position.coords.longitude
            lat = position.coords.latitude

            //AJAX Request to get the weather data of user location

            $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + API_KEY, function (apiData) {
                data = apiData

                // calling the render function

                render(apiData, cel)

                //AJAX Request to timezone data using latitude and longitude

                $.getJSON(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timezone_apikey}&format=json&by=position&lat=${lat}&lng=${long}`, function (timezone_data) {
                    let date_obj = new Date(timezone_data.formatted)
                    date_time.innerHTML = date_obj.toString().slice(4, 10) + "," + "&nbsp;" + date_obj.toTimeString().slice(0, 5)


                    // to convert farenhiet to celsius

                    $(".temperature-degree").click(function () {
                        cel = !cel
                        $(".icon-img").remove();
                        render(data, cel)
                    });
                })
            })

            // finding a current weather details for a city 

            $("#search").click(function (e) {
                e.preventDefault();
                $(".icon-img").remove();

                // Ajax request to get the weather data for the user entered city

                $.getJSON(`https://api.openweathermap.org/data/2.5/weather?q=${city_name.value}&units=imperial&appid=${API_KEY}`, function (city_data) {
                    data = city_data

                    // calling render function to update current weather details

                    render(city_data, cel)

                    // Ajax request to get the current time a user entered city by using longitude and latitude values

                    $.getJSON(`http://api.timezonedb.com/v2.1/get-time-zone?key=${timezone_apikey}&format=json&by=position&lat=${city_data.coord.lat}&lng=${city_data.coord.lon}`, function (timezone_data) {
                        console.log(timezone_data)
                        let date_obj = new Date(timezone_data.formatted)
                        date_time.innerHTML = date_obj.toString().slice(4, 10) + "," + "&nbsp;" + date_obj.toTimeString().slice(0, 5)


                        // to convert farenhiet to celsius

                        $(".temperature-degree").click(function () {
                            cel = !cel
                            $(".icon-img").remove();
                            render(city_data, cel)
                        });
                    })
                });
            });
        })
    }
    else {
        alert("Geolocation is not supported by your browser, download the latest Chrome or Firefox to use this app");
    }


})









