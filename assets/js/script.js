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

async function getArrivalAirport(homeTeamCity) {
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


  
async function flightSearch(event) {
  var buttonClicked = event.target;
  console.log("buttonClicked: ", buttonClicked);

  var departureAirport = getDepartureAirport("chicago");
  console.log("flightSearch departureAirportCode: ", departureAirport);

  var destinationAirport = await getArrivalAirport("New York City");
  console.log("flightSearch destinationAirportCode: ", destinationAirport);
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

        var awayTeamLogo = document.createElement('img');
        awayTeamLogo.src = "assets/images/TeamLogos/"+ awayTeamName.replace(/\s+/g , "-").replace('.', '') + "-logo.png";
        awayTeamLogo.width = 100;
        var homeTeamLogo = document.createElement('img');
        homeTeamLogo.src = "assets/images/TeamLogos/"+ homeTeamName.replace(/\s+/g, "-").replace('.', '') + "-logo.png";
        homeTeamLogo.width = 100;

        console.log(awayTeamLogo);
        console.log(homeTeamLogo);

        var stadium = games[i].venue.name;


        console.log(gameInfo);
        var gameTitle = document.createElement("button");
        gameTitle.setAttribute("class", stadium);
        gameTitle.addEventListener("click", flightSearch);

        todaysGamesEl.append(gameTitle);
        gameTitle.append(awayTeamLogo);
        gameTitle.append(gameInfo);
        gameTitle.append(homeTeamLogo);
      }
    });
}

getTodaysGames();
