var weatherDay, forecastDay

var isDataWeather = (res, day, data, address) => {
    switch (day) {
        case 'today':
            weatherDay = 0
            forecastDay = 0
            break
        case 'tomorrow':
            weatherDay = 2
            forecastDay = 1
            break
        case 'next_tomorrow':
            weatherDay = 4
            forecastDay = 2
            break
        default:
            break
    }
    let weather = data.forecast.simpleforecast.forecastday[forecastDay].conditions
    let temperature = `${data.forecast.simpleforecast.forecastday[forecastDay].low.celsius}C - ${data.forecast.simpleforecast.forecastday[forecastDay].high.celsius}C`
    let forecastday = `${data.forecast.simpleforecast.forecastday[forecastDay].date.year}-${data.forecast.simpleforecast.forecastday[forecastDay].date.month}-${data.forecast.simpleforecast.forecastday[forecastDay].date.day}`
    //let relative_humidity = data.current_observation.relative_humidity
    let forecast = `\r\n- ${data.forecast.txt_forecast.forecastday[weatherDay].fcttext}\r\n`
        + `- ${data.forecast.txt_forecast.forecastday[weatherDay].fcttext_metric}\r\n`

    res.status(200).json({
        source: 'webhook',
        speech: `Your location: ${address}\r\n`
            + `Forecast day: ${forecastday}\r\n`
            + `Weather: ${weather}\r\n`
            + `Temperature: ${temperature}\r\n`
            + `Forecast: ${forecast}\r\n`,
        displayText: `Your location`
    })
}

var isNotDataWeather = (res) => {
    res.status(200).json({
        source: 'webhook',
        speech: 'No data weather forecast.',
        displayText: 'OK'
    })
}

module.exports = {
    isDataWeather,
    isNotDataWeather
}