var got = require('got');
var htmlParse = require("./parseHtml.js").func;
var cal = {};
var BASE_URL  = "http://www.utdallas.edu/calendar/getEvents.php";

cal.getEvents = function(callback) {

	var time = getCurrentTime();
	getCalDataByDay(time.month, time.year, time.day, callback);

};

function getCurrentTime() {
	var time = {};
	var dateToday = new Date();
	time.month = dateToday.getMonth() + 1;
	time.year = dateToday.getFullYear();
	time.day = dateToday.getDate();

	return time;
}
//http://www.utdallas.edu/calendar/getEvents.php?month=10&year=2017&type=day6

function getCalDataByDay(month, year, day, callback) {

	got(BASE_URL+'?month='+month+'&year='+year+'&type=day'+day).then(response => {

	  htmlParse.getJSON(response.body, callback);

	}).catch(error => {
	  console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");	
	  //console.log(error.response.body);
	});	

}




module.exports = {
	cal: cal
};