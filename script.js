function showProject(project) {

    if (project === "weather") {

        document
            .getElementById("weather-project")
            .classList
            .remove("hidden");

        document
            .getElementById("weather-project")
            .scrollIntoView({
                behavior: "smooth"
            });
    }
}


function showMain() {

    document
        .getElementById("weather-project")
        .classList
        .add("hidden");

    document
        .getElementById("projects")
        .scrollIntoView({
            behavior: "smooth"
        });
}


function getWeatherDescription(code) {

    const descriptions = {

        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",

        45: "Fog",
        48: "Depositing rime fog",

        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",

        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",

        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",

        80: "Rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",

        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Thunderstorm with heavy hail"
    };

    return descriptions[code] ||
           "Weather information unavailable";
}


async function checkWeather(city) {

    const message =
        document.getElementById("weather-message");

    const result =
        document.getElementById("weather-result");

    message.textContent =
        "Getting weather information...";

    result.classList.add("hidden");


    try {

        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;

        const geoResponse =
            await fetch(geoUrl);


        if (!geoResponse.ok) {

            throw new Error(
                "Could not search for this city."
            );
        }


        const geoData =
            await geoResponse.json();


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            throw new Error(
                "City not found. Please check the spelling and try again."
            );
        }


        const place =
            geoData.results.find(
                item => item.country_code === "IN"
            ) || geoData.results[0];


        const forecastUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`;


        const forecastResponse =
            await fetch(forecastUrl);


        if (!forecastResponse.ok) {

            throw new Error(
                "Weather data could not be loaded."
            );
        }


        const forecastData =
            await forecastResponse.json();

        const current =
            forecastData.current;


        document.getElementById(
            "weather-city"
        ).textContent =
            `${place.name}${place.admin1 ? ", " + place.admin1 : ""}, ${place.country}`;


        document.getElementById(
            "weather-description"
        ).textContent =
            getWeatherDescription(
                current.weather_code
            );


        document.getElementById(
            "weather-temp"
        ).textContent =
            Math.round(
                current.temperature_2m
            );


        document.getElementById(
            "weather-humidity"
        ).textContent =
            `${current.relative_humidity_2m}%`;


        document.getElementById(
            "weather-wind"
        ).textContent =
            `${current.wind_speed_10m} km/h`;


        result.classList.remove("hidden");

        message.textContent = "";


    } catch (error) {

        message.textContent =
            error.message ||
            "Something went wrong. Please try again.";
    }
}


document
    .getElementById("weather-form")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const city =
                document
                    .getElementById("city-input")
                    .value
                    .trim();

            if (city) {

                checkWeather(city);
            }
        }
    );


document
    .getElementById("contact-form")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const message =
                document
                    .getElementById("message")
                    .value
                    .trim();


            const feedback =
                document.getElementById(
                    "form-message"
                );


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            feedback.className =
                "form-message";


            if (
                !name ||
                !email ||
                !message
            ) {

                feedback.textContent =
                    "Please fill in all the fields.";

                feedback.classList.add(
                    "error"
                );

                return;
            }


            if (
                !emailPattern.test(email)
            ) {

                feedback.textContent =
                    "Please enter a valid email address.";

                feedback.classList.add(
                    "error"
                );

                return;
            }


            feedback.textContent =
                `Thank you, ${name}! Your message has been validated.`;


            feedback.classList.add(
                "success"
            );


            this.reset();
        }
    );


document.getElementById(
    "year"
).textContent =
    new Date().getFullYear();
