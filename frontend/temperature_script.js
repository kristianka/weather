// for date formatting
let options = {
    year: "numeric", month: "numeric",
    day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
};

let chart_options = {
    month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
};

updateView = (data) => {
    // last value which is newest data
    const lastValue = data[data.length - 1].temperature
    document.getElementById("current_temp").innerHTML = parseFloat(lastValue).toFixed(2);
}

populateTable = (data) => {

    document.getElementById("collectors").innerHTML = "";
    const table = document.getElementById("collectors");

    let x = data.length - 1;

    data.map(item => {
        const row = document.createElement("tr");

        let date = new Date(data[x].date_time);
        let format_date = (date.toLocaleTimeString("en-FI", options));

        const timeColumn = document.createElement("td");
        timeColumn.className = "timeColumn";
        timeColumn.innerHTML = format_date;
        row.appendChild(timeColumn);

        const temperatureColumn = document.createElement("td")
        temperatureColumn.className = "temperatureColumn";
        temperatureColumn.innerHTML = parseFloat(data[x].temperature).toFixed(2) + " °C";
        row.appendChild(temperatureColumn);
        table.appendChild(row);
        x--;
    });
};

createChart = (data) => {

    // if chart is true (exists) then destroy it
    if (Chart.getChart("weather_chart")) {
        Chart.getChart("weather_chart").destroy();
    }

    // format date to better form to fit the chart
    for (let x = 0; x < data.length; x++) {
        let date = new Date(data[x].date_time);
        data[x].date_time = date.toLocaleTimeString("en-FI", chart_options);
    }

    new Chart("weather_chart", {
        type: "line",
        data: {
            datasets: [{
                data: data,
                backgroundColor: "red"
            }]
        },
        options: {
            parsing: {
                xAxisKey: 'date_time',
                yAxisKey: 'temperature',
                key: 'temperature'
            },
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: "Temperature readings"
                }
            }
        },
    });
}

fetchAPI = async () => {
    try {
        const URL = "https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/";
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data);
        populateTable(data);
        updateView(data);
        createChart(data);
    } catch (error) {
        console.error(error);
    }
}
fetchAPI();

updateData = async () => {
    try {
        var value = document.getElementById("select_timespan").value;
        if (value === "20") {
            fetchAPI();
        }
        else {
            console.log(value);
            const response = await fetch("https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature/" + value);
            const data = await response.json();
            console.log(data);
            populateTable(data);
            createChart(data);
        }
    } catch (error) {
        console.error(error);
    }
}