/**
 * Date Helper Module
 */
exports.date = {
    convert: function(d) {
       // Converts the date in d to a date-object. The input can be:
       //   a date object: returned without modification
       //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
       //   a number     : Interpreted as number of milliseconds
       //                  since 1 Jan 1970 (a timestamp)
       //   a string     : Any format supported by the javascript engine, like
       //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
       //  an object     : Interpreted as an object with year, month and date
       //                  attributes.  **NOTE** month is 0-11.
       return (
           d.constructor === Date ? d :
           d.constructor === Array ? new Date(d[0],d[1],d[2]) :
           d.constructor === Number ? new Date(d) :
           d.constructor === String ? new Date(d) :
           typeof d === "object" ? new Date(d.year,d.month,d.date) :
           NaN
       );
   },
    compare: function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=exports.convert(a).valueOf()) &&
            isFinite(b=exports.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange: function(d,start,end) {
       // Checks if date in d is between dates in start and end.
       // Returns a boolean or NaN:
       //    true  : if d is between start and end (inclusive)
       //    false : if d is before start or after end
       //    NaN   : if one or more of the dates is illegal.
       // NOTE: The code inside isFinite does an assignment (=).
      return (
           isFinite(d=exports.convert(d).valueOf()) &&
           isFinite(start=exports.convert(start).valueOf()) &&
           isFinite(end=exports.convert(end).valueOf()) ?
           start <= d && d <= end :
           NaN
       );
   },
   /**
    * Month / Day / Year format
    * @param {Object} e The Date() object
    * @returns {Object} Object of date references
    */
    dateMDY: function(e) {
        var d       = e,
            month   = (d.getMonth() + 1).toLocaleString(),
            day     = d.getDate().toLocaleString(),
            year    = d.getFullYear().toLocaleString(),
            hour    = d.getHours().toLocaleString(),
            min     = (d.getMinutes().toLocaleString() < 10) ? 0 + d.getMinutes().toLocaleString() : d.getMinutes().toLocaleString(),
            time    = (hour >= 12) ? 'PM' : 'AM';

        if(hour > 12) {
            hour = hour - 12;
        } else if(hour == 0) {
            hour = 12;
        }

        return {
            month: month,
            day: day,
            year: year,
            hour: hour,
            min: min,
            time: time
        };
    },
    descriptiveDate: function (time, curDateObj) {
        curDateObj = curDateObj || new Date();
        //Check if it is mysql timestamp
        time = time || new Date();
        
        //add 5 hrs bc Vielite´s server is wrong
        var extra =curDateObj.getHours();
        extra=extra+5;
        curDateObj.setHours(extra);
        if(time.split){
            // Apply each element to the Date function
            var t = time.split(/[- :]/);
            var q = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
        } else {
            var q = new Date(time);
        }
        // q.setTime((Number(q) - (q.getTimezoneOffset() * 60 * 1000)));

        // In seconds...
        var diff = ( Number(curDateObj) - Number(q) ) / 1000;
        var yesterday = curDateObj.getDay() - q.getDay();

        function dayDate(day) {
            var realDay = null;

            switch(day) {
                case 0:
                    realDay = L('sunday');
                break;
                case 1:
                    realDay = L('monday');
                break;
                case 2:
                    realDay = L('tuesday');
                break;
                case 3:
                    realDay = L('wednesday');
                break;
                case 4:
                    realDay = L('thursday');
                break;
                case 5:
                    realDay = L('friday');
                break;
                case 6:
                    realDay = L('saturday');
                break;
            }

            return realDay;
        };

        // Make some nice looking times.
        if ( diff < 60 ) { // Within a minute.
            return L("just_now");
        } else if ( diff < 120 ) {
            return L("about_minute_ago");
        } else if ( diff < 3600 ) { // Within an hour
            var minutesAgo = Math.floor(diff / 60);
            return  String.format( L('x_minutes_ago'), minutesAgo ); //Math.floor(diff / 60) + " minutes ago";
        } else if ( diff < 6300 ) { // Within 1.75 hours
            return L("about_hour_ago");
        } else if ( diff < 86400 ) { // Within a day
            var hoursAgo = Math.floor(diff / 60 / 60);
            return String.format( L('x_hours_ago'), hoursAgo ); //hoursAgo + " hour" + ( hoursAgo != 1 ? "s" : "" ) + " ago";
        }else if ( diff < 604800 ) { // Within a week
            var dayName = (( yesterday == 1 || yesterday == -6 ) ? L('yesterday') : dayDate( q.getDay() ));
           // return  String.format( L('day_at_hour'), dayName, String.formatTime(q) );
            return  String.format( L('x_days_ago'), Math.floor(diff / 60 / 60 / 24 ) ); //Math.floor(diff / 60 / 60 / 24 ) + " days ago";
        } else { // Anything outside of that just shows a date.
            d = q.toLocaleString().split(' ');
            // return '' + d[0] + ' ' + d[1].replace(/,/, L('at')), String.formatTime(q);

            return  String.formatDate(q) + " " + String.formatTime(q);
        }
    }
};