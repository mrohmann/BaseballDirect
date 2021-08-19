var requestUrl = "https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1";
var todaysGamesEl = document.getElementById("todaysgames");

function getDepartureAirport(usersCity) {
  console.log("getDepartureAirport input: ", usersCity);

  var departureSearchURL =
    "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" +
    usersCity;
  console.log("departureURL: ", departureSearchURL);

  fetch(departureSearchURL, {
    method: "GET",
    headers: {
      "x-rapidapi-key": "2e3c634b2dmsh141fbff444002ccp175fe7jsn0f7c102fb43f",
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var departureAirport = data.Places[0].PlaceId;
      console.log("getDepartureAirport output: ", departureAirport);
      return departureAirport;
    });
}

function getArrivalAirport(homeTeamCity) {
  console.log("getDepartureAirport input: ", homeTeamCity);

  var destinationSearchURL =
    "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" +
    homeTeamCity;
  console.log("destinationSearchURL: ", destinationSearchURL);

  fetch(destinationSearchURL, {
    method: "GET",
    headers: {
      "x-rapidapi-key": "2e3c634b2dmsh141fbff444002ccp175fe7jsn0f7c102fb43f",
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var destinationAirport = data.Places[0].PlaceId;
      console.log("getArrivalAirport output: ", destinationAirport);
      return destinationAirport;
    });
}

function displayFlightInfo() {}

  var departureAirport = getDepartureAirport("chicago");
  console.log("flightSearch departureAirportCode: ", departureAirport);

  var destinationAirport = getArrivalAirport("New York City");
  console.log("flightSearch destinationAirportCode: ", destinationAirport);
  
function flightSearch(event) {
  var buttonClicked = event.target;
  console.log("buttonClicked: ", buttonClicked);


  var outboundDate = moment().format("YYYY-MM-DD"); //set to current date temporarily
  console.log("outbound Date: ", outboundDate);

  var flightSearchURL =
    "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/US/USD/en-US/" +
    departureAirport +
    "/" +
    destinationAirport +
    "/" +
    outboundDate;

  console.log(flightSearchURL);

  fetch(flightSearchURL, {
    method: "GET",
    headers: {
      "x-rapidapi-key": "2e3c634b2dmsh141fbff444002ccp175fe7jsn0f7c102fb43f",
      "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cheapestFlightPrice = data.Quotes[0].MinPrice;
      console.log("CheapestFlightPrice", cheapestFlightPrice);

      var cheapestAirline = data.Carriers[0].Name;
      console.log("CheapestAirline", cheapestAirline);
    });

  //displayFlightInfo();
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
        var gameDate = moment(games[i].gameDate).format("dddd, MMMM Do YYYY, h:mm:ss a");

        var awayTeamName = games[i].teams.away.team.name;
        var homeTeamName = games[i].teams.home.team.name;

        var awayTeamLogo; //image   assets\images\teamlogos\"awayTeamName+'logo'.png"
        var homeTeamLogo; //image   assets\images\Team Logos\"homeTeamName+'logo'.png"

        var stadium = games[i].venue.name;
        var gameInfo = awayTeamName + " vs. " + homeTeamName + " on " + gameDate + " at " + stadium;

        console.log(gameInfo);
        var gameTitle = document.createElement("button");
        var awayTeamLogo; //image   assets\images\teamlogos\"awayTeamName+'logo'.png"
        var homeTeamLogo; //image   assets\images\Team Logos\"homeTeamName+'logo'.png"
        gameTitle.setAttribute("class", stadium);
        gameTitle.addEventListener("click", flightSearch);

        todaysGamesEl.append(gameTitle);
        gameTitle.textContent = gameInfo;
      }
    });
}

getTodaysGames();
