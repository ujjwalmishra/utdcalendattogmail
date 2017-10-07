var func = {}
var cheerio = require("cheerio");
var moment = require('moment-timezone');

var eventObj = {
  'summary': '',
  'location': '',
  'description': '',
  'start': {
    'dateTime': '',
    'timeZone': 'America/Chicago',
  },
  'end': {
    'dateTime': '',
    'timeZone': 'America/Chicago',
  },
  'attendees': [
     ],
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=1'
  ],   
  'reminders': {
    'useDefault': false,
    'overrides': [],
  },
};

func.getJSON = function(html, callback) {
	var $ = cheerio.load(html);
	var emptyArr = [];
	
	//console.log(html);
	$('.cal-line-details-events li').each(function(i, elem) {
  		//fruits[i] = $(this).text();
  		var timeString = $(this).find('.events-time').text().trim();
  		var startTime;
  		var endTime;
  		var timeArray;
  		var newObj = {};
  		if(timeString.includes('-')) {
  			timeArray = timeString.split('-');
  			startTime = timeArray[0];
  			endTime = timeArray[1];
  		}
  		else {
  			startTime = timeString.trim();
  			endTime = null;
  		}
  		startTime = generateTimeStamp(startTime);
  		endTime = generateTimeStamp(endTime);
  		if(!endTime || endTime == startTime) {
  			endTime = moment(startTime).add(30, 'minutes').format();
  		}
  		var eventTitle = $(this).find('.eventTitle').text().trim();
  		var eventDesc = $(this).find('.events-name').html();
  		// console.log(i);
  		// console.log(startTime);
  		// console.log(endTime);
  		newObj = deepClone(eventObj);
  		  		
  		newObj.summary = eventTitle;
  		newObj.description = eventDesc;
  		newObj.start.dateTime = startTime;
  		newObj.end.dateTime = endTime;
  		  		
  		if(eventTitle && eventDesc && startTime) {
			emptyArr.push(newObj);
  		}  
  		//console.log(emptyArr);
  		//return emptyArr;		
  		//console.log($(this).find('.events-time').text());
	});
  	callback(emptyArr);
}

function generateTimeStamp(rawTimeStr) {
	var now = new Date();
	if(!rawTimeStr || rawTimeStr.length < 3) {
		return null;
	}
	rawTimeStr = rawTimeStr.trim();
	if(rawTimeStr.includes('a')) {
		var hour = rawTimeStr.split(':')[0];
		hour = hour==12? 0: hour; 
		now.setHours(hour, rawTimeStr.split(':')[1].split(" ")[0]);

		//return moment(now).tz("America/Chicago").format();
		return moment(now).format();
	}
	else {
		var hour = parseInt(rawTimeStr.split(':')[0]);
		hour = hour==12? hour: hour + 12;
		now.setHours(hour, rawTimeStr.split(':')[1].split(" ")[0]);
		return moment(now).format();
		//return moment(now).format();
	}
}

function deepClone(Obj) {
   return JSON.parse(JSON.stringify(Obj));
}



module.exports = {func : func};