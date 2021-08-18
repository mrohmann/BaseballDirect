var requestUrl = "http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1";
var todaysGamesEl = document.getElementById("todaysgames");
var arrivalAirport;
var departureAirport;

function getDepartureAirport(usersCity) {
  console.log(usersCity + " get departure Airport");
  var departureURL = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" +
      usersCity ;
  console.log("departureURL: ", departureURL)
  fetch(departureURL ,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": "2e3c634b2dmsh141fbff444002ccp175fe7jsn0f7c102fb43f",
        "x-rapidapi-host":
          "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      },
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      departureAirport = data.Places[0].PlaceId;
      console.log(departureAirport + " getDeparture");
      //return departure;
    });
  
};

function getArrivalAirport(homeTeamCity) {
  console.log(homeTeamCity + " get arrival Airport");
  fetch(
    "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" +
      homeTeamCity,
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": "2e3c634b2dmsh141fbff444002ccp175fe7jsn0f7c102fb43f",
        "x-rapidapi-host":
          "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      },
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      arrivalAirport = data.Places[0].PlaceId;
      console.log(arrivalAirport + " getArrival");
     // return destination;
    });
  
};

function flightSearch(event) {
  var buttonClicked = event.target;
  console.log("buttonClicked: ",buttonClicked);
  //getDepartureAirport("Chicago");
  //getArrivalAirport("New York City");
  var outboundDate = moment().format("YYYY-MM-DD"); //set to current date temporarily
  //console.log(cityName);
  console.log(departureAirport + " why");
  console.log(arrivalAirport + " why");

  var flightURL =
    "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/US/USD/en-US/" +
    departureAirport +
    "/" +
    arrivalAirport +
    "/" +
    outboundDate;

  console.log(flightURL);

  fetch(flightURL, {
    method: "GET",
    headers: {
      "x-rapidapi-key": "2e3c634b2dmsh141fbff444002ccp175fe7jsn0f7c102fb43f",
      "x-rapidapi-host":
        "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cheapestFlight = data.Quotes[0].MinPrice;
      var cheapestAirline = data.Carriers[0].Name;
      console.log(
        "CheapestFlight: $" + cheapestFlight + " on " + cheapestAirline
      );
    });
}

function getTodaysGames() {
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var games = data.dates[0].games;
      console.log(games);

      for (i = 0; i < games.length; i++) {
        var gameDate = moment(games[i].gameDate).format(
          "dddd, MMMM Do YYYY, h:mm:ss a"
        );

        var awayTeamName = games[i].teams.away.team.name;
        var homeTeamName = games[i].teams.home.team.name;

        var stadium = games[i].venue.name;
        var gameInfo =
          awayTeamName +
          " vs. " +
          homeTeamName +
          " on " +
          gameDate +
          " at " +
          stadium;

        console.log(gameInfo);
        var gameTitle = document.createElement("button");
        gameTitle.setAttribute("class", stadium);
        //gameTitle.setAttribute("onclick", flightSearch()); // probably a terrible edit going to break everything!
          gameTitle.addEventListener('click',flightSearch);
        todaysGamesEl.append(gameTitle);
        gameTitle.textContent = gameInfo;
      }
    });
}

getTodaysGames();
