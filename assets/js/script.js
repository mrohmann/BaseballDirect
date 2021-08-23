var todaysGamesEl = document.getElementById("todaysgames");
var locationEl = document.getElementById("user-location");
var submitBtnEl = $("#submit");
var whatDaysGamesEl = document.getElementById("whatDaysGames");
var modalEl = $(".modal");
var modalCloseBtn = $(".modal-close");
var dateInput = document.getElementById("date-input");

var departureAirport = { code: "", fullName: "" };
var destinationAirport = { code: "", fullName: "" };
var date;
var usersCity;
var stadiumList = [
  {
    stadium: "American Family Field",
    city: "Milwaukee",
  },
  {
    stadium: "Angel Stadium",
    city: "Anaheim",
  },
  {
    stadium: "Busch Stadium",
    city: "St Louis",
  },
  {
    stadium: "Chase Field",
    city: "Phoenix",
  },
  {
    stadium: "Citi Field",
    city: "Queens",
  },
  {
    stadium: "Citizens Bank Park",
    city: "Philadelphia",
  },
  {
    stadium: "Comerica Park",
    city: "Detroit",
  },
  {
    stadium: "Coors Field",
    city: "Denver",
  },
  {
    stadium: "Dodger Stadium",
    city: "Los Angeles",
  },
  {
    stadium: "Fenway Park",
    city: "Boston",
  },
  {
    stadium:'Globe Life Field',
    city:'Dallas',
  },
  {
    stadium: "Great American Ball Park",
    city: "Cincinnati",
  },
  {
    stadium: "Guaranteed Rate Field",
    city: "Chicago",
  },
  {
    stadium: "Kauffman Stadium",
    city: "Kansas City",
  },
  {
    stadium:'loanDepot park',
    city:'Miami',
  },
  {
    stadium: "Minute Maid Park",
    city: "Houston",
  },
  {
    stadium: "Nationals Park",
    city: "Washington, DC",
  },
  {
    stadium: "Oakland Coliseum",
    city: "Oakland",
  },
  {
    stadium: "Oracle Park",
    city: "San Fransisco",
  },
  {
    stadium: "Oriole Park at Camden Yards",
    city: "Baltimore",
  },
  {
    stadium: "Petco Park",
    city: "San Diego",
  },
  {
    stadium: "PNC Park",
    city: "Pittsburg",
  },
  {
    stadium:'Progressive Field',
    city:'Cleveland'
  },
  {
    stadium: "Rogers Centre",
    city: "Toronto",
  },
  {
    stadium: "T-Mobile Park",
    city: "Seattle",
  },
  {
    stadium: "Target Field",
    city: "Minneapolis",
  },
  {
    stadium: "Tropicana Field",
    city: "St Petersburg,Fl",
  },
  {
    stadium: "Truist Park",
    city: "Cumberland",
  },
  {
    stadium: "Wrigley Field",
    city: "Chicago",
  },
  {
    stadium: "Yankee Stadium",
    city: "Bronx",
  },
];

if (localStorage.length == 0) {
  dateInput.value = moment().format("YYYY-MM-DD");
  locationEl.value = "";
} else {
  dateInput.value = JSON.parse(localStorage.getItem("gameDateAndUsersCity")).date;
  locationEl.value = JSON.parse(localStorage.getItem("gameDateAndUsersCity")).usersCity;
}

submitBtnEl.on("click", function () {
  date = dateInput.value;

  console.log(date);
  usersCity = locationEl.value;
  console.log(usersCity);
  getTodaysGames(date);

  var gameDateAndUserCity = { date: date, usersCity: usersCity };

  if (date && usersCity) {
    localStorage.setItem("gameDateAndUsersCity", JSON.stringify(gameDateAndUserCity));
  }

  return { usersCity, date };
});

async function getDepartureAirport(usersCity) {
  console.log("getDepartureAirport input: ", usersCity);

  var departureSearchURL =
    "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" +
    usersCity;
  console.log("departureURL: ", departureSearchURL);

  await fetch(departureSearchURL, {
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
      console.log(data);
      departureAirport.code = data.Places[0].PlaceId;
      //departureAirport.fullName =data.Places[0].PlaceName;
      console.log("getDepartureAirport output: ", departureAirport);
    });
  return departureAirport;
}

async function getArrivalAirport(homeTeamCity) {
  console.log("getDepartureAirport input: ", homeTeamCity);

  var destinationSearchURL =
    "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" +
    homeTeamCity;
  console.log("destinationSearchURL: ", destinationSearchURL);

  await fetch(destinationSearchURL, {
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
      //onsole.log(data);
      destinationAirport.code = data.Places[0].PlaceId;
      //console.log("getArrivalAirport output: ", destinationAirport);
      //destinationAirport.fullName =data.Places[0].PlaceName;
    });
  return destinationAirport;
}

function displayFlightInfo(price, airline, departure, destination, stadium) {
  modalEl.addClass("is-active");

  var stadiumLogo = document.getElementById("stadium-logo");
  //console.log(stadium);
  stadiumLogo.src = "assets/images/StadiumLogos/" + stadium.replace(/\s+/g, "") + ".jpg";
  // console.log(stadiumLogo);

  var flightInfoEl = document.getElementById("flight-info");
  flightInfoEl.innerHTML =
    "The Cheapest Flight to " +
    stadium +
    " leaves from " +
     departure +
    " Airport and arrives at " +
    destination +
    " Airport. This ticket is on " +
    airline +
    " and costs $" +
    price +
    ".";

  modalCloseBtn.click(function () {
    $(".modal").removeClass("is-active");
  });
}

function displayErrorMessage() {
  modalEl.addClass("is-active");
  var stadiumLogo = document.getElementById("stadium-logo");
  //console.log(stadium);
  stadiumLogo.src = "assets/images/SorryError.jpg";

  var flightInfoEl = document.getElementById("flight-info");
  flightInfoEl.innerHTML = "Sorry! No Cheap Flights Were Found!";

  modalCloseBtn.click(function () {
    $(".modal").removeClass("is-active");
  });
}

function getStadiumCity(stadium) {
  for (i = 0; i < stadiumList.length; i++) {
    if (stadium === stadiumList[i].stadium) {
      console.log(stadiumList[i].city);
      return stadiumList[i].city;
    }
  }
}

async function flightSearch(event) {
  var buttonClicked = event.target;
  console.log("buttonClicked: ", buttonClicked);
  var stadium = buttonClicked.className;
  var homeTeamCity = getStadiumCity(stadium);

  departureAirport = await getDepartureAirport(usersCity);
  console.log("flightSearch departureAirportCode: ", departureAirport);

  destinationAirport = await getArrivalAirport(homeTeamCity);
  console.log("flightSearch destinationAirportCode: ", destinationAirport);

  var outboundDate = date;

  console.log("outbound Date: ", outboundDate);

  var flightSearchURL =
    "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" +
    departureAirport.code +
    "/" +
    destinationAirport.code +
    "/" +
    outboundDate +
    "?";

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
      console.log(data);
      if (data.Quotes.length > 0) {
        var cheapestFlightPrice = data.Quotes[0].MinPrice;
        console.log("CheapestFlightPrice", cheapestFlightPrice);

        var cheapestAirline = data.Carriers[0].Name;
        console.log("CheapestAirline", cheapestAirline);

        if((data.Quotes[0].OutboundLeg.OriginId) === (data.Places[0].PlaceId))
        {
          departureAirport.fullName = data.Places[0].Name;
          destinationAirport.fullName = data.Places[1].Name;
        }
        else
        {
          departureAirport.fullName = data.Places[1].Name;
          destinationAirport.fullName = data.Places[0].Name;
        };

        

        displayFlightInfo(
          cheapestFlightPrice,
          cheapestAirline,
          departureAirport.fullName,
          destinationAirport.fullName,
          stadium
        );
      } else {
        displayErrorMessage();
      }
    });
}

function getTodaysGames(date) {
  var requestUrl = "https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date=" + date;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var games = data.dates[0].games;
      
    console.log(games);
      todaysGamesEl.innerHTML = "";

      for (i = 0; i < games.length; i++) {
        var gameDate = moment(games[i].gameDate).format("dddd, MMMM Do YYYY, h:mm:ss a");

        var awayTeamName = games[i].teams.away.team.name;
        var homeTeamName = games[i].teams.home.team.name;

        var awayTeamLogo = document.createElement("img");
        awayTeamLogo.src =
          "assets/images/TeamLogos/" +
          (awayTeamName.replace(/\s+/g, "-").replace(".", "") + "-logo.png").toLowerCase();
        awayTeamLogo.width = 100;
        var homeTeamLogo = document.createElement("img");
        homeTeamLogo.src =
          "assets/images/TeamLogos/" +
          (homeTeamName.replace(/\s+/g, "-").replace(".", "") + "-logo.png").toLowerCase();
        homeTeamLogo.width = 100;

        // console.log(awayTeamLogo);
        // console.log(homeTeamLogo);

        var stadium = games[i].venue.name;
        var gameInfo = awayTeamName + " vs. " + homeTeamName + " on " + gameDate + " at " + stadium;

        // console.log(gameInfo);

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



=======
getTodaysGames(dateInput.value);

