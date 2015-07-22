$(document).ready(function () {

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
    $.ajax({
      context: this,
      type: "GET",
      url: ajaxURL,
      success: function(response){
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
      }   
    })
  };

  Chart.prototype.graphData = function () {
    var highChartConfig = {
      chart: {
        plotBackgroundImage:"http://cdn.asian-weather.com/img/background/background.jpg"
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
          text: "Temperature (K)"
        }
      },
      series: this.dataArray
    };

    $('#chart').highcharts(highChartConfig);
  }

  var newChart = new Chart();
  newChart.getAllAjaxRequest();
});