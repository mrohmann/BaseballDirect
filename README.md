# BaseballDirect
Application to look up MLB games on a chosen date and display cheap flights to those cities

Css alternative  -  Bulma  
Api’s - sportsdb api  & google flight




Google Map API in case flight doesn’t work out
https://developers.google.com/maps/documentation/javascript/reference/directions#TransitVehicle 






User Story
AS a huge baseball fan 
I WANT to be able to view daily sporting events and be able to select available flights to the game.
SO THAT I can attend live events directly from the website.


Acceptance Criteria

GIVEN I am using a daily planner to create a schedule
WHEN I open the planner
THEN the current day is displayed at the top of the calendar
WHEN I scroll down
THEN I am presented with timeblocks for standard business hours
WHEN I view the timeblocks for that day
THEN each timeblock is color coded to indicate whether it is in the past, present, or future
WHEN I click into a timeblock
THEN I can enter an event
WHEN I click the save button for that timeblock
THEN the text for that event is saved in local storage
WHEN I refresh the page
THEN the saved events persist
