//Last change was getting the calls to work, in renderCards function. Successfully have the cityname and date rendering at top.
//Last change will be creating the 5-day forecast and getting the for loop to work on line 53
//Working on getting uvi to change color
var apiKey = "ddca18695b6c1bf64578126a6b05af1f";
var input = document.getElementById("searchBar").value;

//Defaults page on load to Atlanta's weather
function resetCards () {

    $(`#weather`).text("");

    for (var i = 0; i < 5; i++) {
        $(`#day${i + 1}`).text("");
    };
}

//function for calling the weather api and gathering the data for the inputted city
async function fetchWeather (city) {
    //Fetching the specified city's weather
    var cityApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    let cityCall = await fetch(cityApi)
        .then(response => response.json())
        .then(data => {
            return data;
        });
    
    //Fetching the city's coordinates for other data
    var lat = cityCall.coord.lat;
    var lon = cityCall.coord.lon;
    
    var coordinateApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

    let latLonFetch = await fetch(coordinateApi)
        .then(response => response.json())
        .then(data => {
            return data;
    });

    var date = new Date(latLonFetch.current.dt * 1000);
    var dateString = "${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()})";
    document.getElementById("weather").innerHTML 

    return latLonFetch;

}

//Function for getting the UV index and changing its color
function UviColor(Uvi) {

    $(`#uvi`).removeClass();
    $(`#uvi`).addClass("p-1 border rounded rounded-4");
    
    if (Uvi < 3) {
        $(`#uvi`).addClass("bg-success");
    } else if (Uvi >= 3 || Uvi < 7) {
        $(`#uvi`).addClass("bg-warning");
    } else {
        $(`#uvi`).addClass("bg-failure");
    }
    
}

//function for rendering the html for the weather cards
async function renderCards (city) {

    resetCards();

    let cardData = await fetchWeather(city);
    
    var date = new Date(cardData.daily[0].dt * 1000);

    var uvi = cardData.current.uvi;

    document.getElementById("weather").innerHTML += `<h2>${city} ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</h2>` +
        `<h4>Temp: ${cardData.current.temp} F</h4>` +
        `<h4>Wind: ${cardData.current.wind_speed} MPH</h4>` + 
        `<h4>Humidity: ${cardData.current.humidity}%</h4>`;
        // `<h4 class="uvi">UV Index: ${uvi}</h4>`;

    if (uvi < 3) {
        document.getElementById("weather").innerHTML += `<h4 class="uvi bg-success">UV Index: ${uvi}</h4>`;
    } else if (uvi >= 3 && uvi < 8) {
        document.getElementById("weather").innerHTML += `<h4 class="uvi bg-warning">UV Index: ${uvi}</h4>`;
    } else {
        document.getElementById("weather").innerHTML += `<h4 class="uvi bg-failure">UV Index: ${uvi}</h4>`;
    };

    for (var i = 0; i < 5; i++) {

        var date = new Date(cardData.daily[i + 1].dt * 1000);

        document.getElementById(`day${i + 1}`).innerHTML += 
            `<i class="bi bi-sun"></i>` + 
            `<h2>${date.getMonth() + 1}/${date.getDate()}</h2>` +
            `<h4>Temp: ${cardData.daily[i + 1].temp.day} F</h4>` +
            `<h4>Wind: ${cardData.daily[i + 1].wind_speed} MPH</h4>` + 
            `<h4>Humidity: ${cardData.daily[i + 1].humidity}%</h4>`;
    };
}

//Saves the searched city in local storage
function saveHistory(search) {

    var pSearch = JSON.parse(localStorage.getItem("history"));
    pSearch.unshift(search);
    localStorage.setItem("history", JSON.stringify(pSearch));
}

//Pulls the history from local storage
function getHistory() {

    let searchHistory = JSON.parse(localStorage.getItem("history"));
    if (!searchHistory) {

        searchHistory = ["Atlanta"];
        localStorage.setItem("history", JSON.stringify(searchHistory));
        return searchHistory;
    } else {
        return searchHistory;
    }
}

//Loads the localstorage history for searches
function pullHistory() {

    let searchHistory = getHistory();
    $(`.history`).text("");

    for (let i = 0; i < 10; i++) {

        if (searchHistory[i]) {
            searchButtonEl = $("<button></button>").text(searchHistory[i]);
            searchButtonEl.attr("id", searchHistory[i]);
            
            searchButtonEl.on("click", (event) => {
                renderCards(event.target.id);
                saveHistory(event.target.id);
            });
            $(`.history`).append(searchButtonEl);

        }
    }
}


renderCards("Atlanta");
getHistory();
pullHistory();

$(`#searchBtn`).on("click", () => {

    renderCards($(`#searchBar`).val());
    saveHistory($(`#searchBar`).val());
    pullHistory();
});