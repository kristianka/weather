// for date formatting
let options = {
    year: "numeric", month: "numeric",
    day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
};

let chart_options = {
    month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
};

populateTable = (data) => {

    document.getElementById("collectors").innerHTML = "";
    const table = document.getElementById("collectors");
    let x = data.length - 1;

    data.map(item => {
        const row = document.createElement("tr");

        let date = new Date(data[x].date_time);
        let format_date = (date.toLocaleTimeString("en-FI", options));
        let val = document.getElementById("select_data").value;

        const timeColumn = document.createElement("td");
        timeColumn.className = "timeColumn";
        timeColumn.innerHTML = format_date;
        row.appendChild(timeColumn);

        // display all data
        if (val === "all") {
            // Where you are iterating over the data
            const key = Object.keys(data[x].data);
            // Now key will be equal to temperature, wind_speed, etc.
            // We can then use the key to retrieve the value from the object
            const value = data[x].data[key];

            const typeColumn = document.createElement("td")
            typeColumn.className = "type_column";
            typeColumn.innerHTML = key;
            row.appendChild(typeColumn);

            const dataColumn = document.createElement("td")
            dataColumn.className = "data_column";
            dataColumn.innerHTML = parseFloat(value).toFixed(2);
            row.appendChild(dataColumn);
        }
        // display specific data
        else {
            const typeColumn = document.createElement("td")
            typeColumn.className = "type_column";
            typeColumn.innerHTML = val;
            row.appendChild(typeColumn);

            document.getElementById("h2_signal_type").innerHTML = val;

            const dataColumn = document.createElement("td")
            dataColumn.className = "data_column";

            // multiple if statements with precision set to two decimals
            if (val === "Air_pres_1")
                dataColumn.innerHTML = parseFloat(data[x].Air_pres_1).toFixed(2);
            if (val === "humidity_in")
                dataColumn.innerHTML = parseFloat(data[x].humidity_in).toFixed(2);
            if (val === "humidity_out")
                dataColumn.innerHTML = parseFloat(data[x].humidity_out).toFixed(2);
            if (val === "light")
                dataColumn.innerHTML = parseFloat(data[x].light).toFixed(2);
            if (val === "rain")
                dataColumn.innerHTML = parseFloat(data[x].rain).toFixed(2);
            if (val === "temperature")
                dataColumn.innerHTML = parseFloat(data[x].temperature).toFixed(2);
            if (val === "wind_direction")
                dataColumn.innerHTML = parseFloat(data[x].wind_direction).toFixed(2);
            if (val === "wind_speed")
                dataColumn.innerHTML = parseFloat(data[x].wind_speed).toFixed(2);

            row.appendChild(dataColumn);
        }
        table.appendChild(row);
        x--;
    });
};

createChart = (data) => {
    const arraySize = data.length - 1;

    // if chart is true (exists) then destroy it
    if (Chart.getChart("weather_chart")) {
        Chart.getChart("weather_chart").destroy();
    }

    for (let x = 0; x < data.length; x++) {
        let date = new Date(data[x].date_time);
        data[x].date_time = date.toLocaleTimeString("en-FI", chart_options);
    }

    let dataValue = document.getElementById("select_data").value;

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
                yAxisKey: dataValue,
                key: 'temperature'
            },
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: dataValue + " readings"
                }
            }
        },
    });
}

fetchAPI = async () => {
    try {
        const URL = "https://webapi19sa-1.course.tamk.cloud/v1/weather/limit/20/";
        const response = await fetch(URL);
        const data = await response.json();
        populateTable(data);

    } catch (error) {
        console.error(error);
    }
}
fetchAPI();

updateData = async () => {
    var type = document.getElementById("select_data").value;
    var value = document.getElementById("select_timespan").value;

    if (type === "all") {
        const URL = "https://webapi19sa-1.course.tamk.cloud/v1/weather/limit/" + value;
        const response = await fetch(URL);
        const data = await response.json();
        // delete old table from old values if exists
        if (Chart.getChart("weather_chart")) {
            Chart.getChart("weather_chart").destroy();
        }
        populateTable(data);
    }
    else {
        if (value === "20") {
            const response = await fetch("https://webapi19sa-1.course.tamk.cloud/v1/weather/" + type);
            const data = await response.json();
            populateTable(data);
            createChart(data);
        }
        else {
            const response = await fetch("https://webapi19sa-1.course.tamk.cloud/v1/weather/" + type + "/" + value);
            const data = await response.json();
            populateTable(data);
            createChart(data);
        }
    }
}
