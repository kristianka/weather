updateView = (data) => {
    const lastValue = data[data.length - 1].temperature
    document.getElementById("current_temp").innerHTML = parseFloat(lastValue).toFixed(2);
}

fetchWeather = async () => {
    try {
        const response = await fetch("https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature");
        const data = await response.json();
        console.log(data);
        updateView(data);
    } catch (error) {
        console.error(error)
    }
}

fetchWeather();
