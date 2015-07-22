$(document).ready(function () {
  var CurrentWeather = function () {

  }

  CurrentWeather.prototype.getWeather = function (city) {
    $.ajax({
      context: this,
      type: "GET",
      url:'http://api.openweathermap.org/data/2.5/weather?q=' + city,
      success: function (response) {
        console.log(response);
        var temp = response.main.temp;
        var main = response.weather[0].main;
        var icon = response.weather[0].icon;
        temp = Math.floor(eval(temp-273.15));

        htmlText = "<h1>Current Weather: ";
        htmlText += temp;
        htmlText += '&deg;C</h1><img src="http://openweathermap.org/img/w/' + icon + '.png" />'
        $('#current-weather').html(htmlText);
        switch (main) {
          case "Thunderstorm":
            $('body').css("background-image","url(../img/thunderstorm.jpg)");
            break;
          case "Drizzle":
            $('body').css("background-image","url(../img/drizzle.jpg)");
            break;
          case "Rain":
             $('body').css("background-image","url(../img/rain.jpg)");
            break;
          case "Snow":
            $('body').css("background-image","url(../img/snow.jpg)");
            break;
          case "Atmosphere":
            $('body').css("background-image","url(../img/mist.jpg)");
            break;
          case "Clouds":
              $('body').css("background-image","url(../img/clouds.jpg)");
            break;
          case "Extreme":
            $('body').css("background-image","url(../img/extreme.jpg)");
            break;
          default:
            $('body').css("background-image","url(../img/sunny.jpg)");
        }
      }
    })
  }


  var Chart = function () {
    this.dataArray = [];
  };

  Chart.prototype.getAllAjaxRequest = function () {
    var cityArray = [{
      name: 'Boston',
      url: 'http://api.openweathermap.org/data/2.5/history/city?q=boston&type=day'
    },{
      name: 'NYC',
      url: 'http://api.openweathermap.org/data/2.5/history/city?q=nyc&type=day'
    },{
      name: 'Hong Kong',
      url: 'http://api.openweathermap.org/data/2.5/history/city?q=hongkong&type=day'
    }];

    for(var i = 0; i < cityArray.length; i++) {
      this.getOneAjaxRequest(i, cityArray[i].name, cityArray[i].url );
    }

    $(document).ajaxStop(function(){
      console.log("hello");
      newChart.graphData();
    });
  }


  Chart.prototype.getOneAjaxRequest = function (index, cityEntered, ajaxURL) {
    var successFunction = function(response){
        this.dataArray[index] = {
          color: "#000000",
          name: cityEntered
        }
        this.dataArray[index].data = [];
        item = response.list;
        for (var i = 0; i < item.length; i++) {
          this.dataArray[index].data.push({
            x: new Date(item[i].dt*1000),
            y: item[i].main.temp
          });
        }
        console.log(this.dataArray);
        this.counter++;
      };
    $.ajax({
      context: this,
      type: "GET",
      url: ajaxURL,
      success: successFunction  
    });
  };

  Chart.prototype.graphData = function () {
    var highChartConfig = {
      chart: {
        backgroundColor:'rgba(255, 255, 255, 0.4)'
      },
      title: {
        text: "Historical Temperatures"
      },
      subtitle: {
        text: "openweathermap.org"
      },
      legend: {
        align:"right",
        layout: "vertical",
        verticalAlign: "middle"
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        min: 250,
        max: 350,
        title: {
          text: "Temperature (°K)"
        }
      },
      series: this.dataArray
    };

    $('#chart').highcharts(highChartConfig);
  }

  var newChart = new Chart();
  newChart.getAllAjaxRequest();

  var currentWeather = new CurrentWeather();
  currentWeather.getWeather("HongKong");
});