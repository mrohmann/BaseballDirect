var requestUrl = "http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1";
var todaysGamesEl = document.getElementById('todaysgames');

function flightSearch(el){
    
var cityName = el.className;

fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + departureAirport + "/" + arrivalAirport  + "/" + outboundDate + "?inboundpartialdate=2019-12-01", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "2e3c634b2dmsh141fbff444002ccp175fe7jsn0f7c102fb43f",
		"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.error(err);
});
};

fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var games = data.dates[0].games;
    console.log(games);

    for(i=0; i<games.length; i++){
        var gameDate =moment(games[i].gameDate).format("dddd, MMMM Do YYYY, h:mm:ss a");
       // console.log(gameDate);
     var awayTeamName = games[i].teams.away.team.name;
     var homeTeamName = games[i].teams.home.team.name;
   //console.log(awayTeamName + " vs. " + homeTeamName +
    //" on " + gameDate);
    var stadium = games[i].venue.name;
    var gameInfo = awayTeamName + " vs. " + homeTeamName +
    " on " + gameDate + " at " + stadium;
    //var stadiumCity=games[i].venue.city;
    //console.log(stadiumCity);
    console.log(gameInfo);
    var gameTitle = document.createElement('button');
    gameTitle.setAttribute("class", stadium);
    gameTitle.setAttribute('onclick','flightSearch(this)'); // probably a terrible edit going to break everything!

    todaysGamesEl.append(gameTitle); 
    gameTitle.textContent = gameInfo;  
    };
  });