const proxyUrl = "http://localhost:3000/proxy-flights";

async function searchFlights() {
    const departureID = document.querySelector("#departureID").value;
    const arrivalID = document.querySelector("#arrivalID").value;
    const outboundDate = document.querySelector("#outboundDate").value;
    try {
        const response = await fetch(`${proxyUrl}?departureID=${departureID}&arrivalID=${arrivalID}&outboundDate=${outboundDate}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        displayResults(data);
    } catch (error) {
        console.error("Error fetching flights:", error);
        alert("An error occurred while fetching flight data. Please try again.");
    }
}

function displayResults(data) {
    var departureID = document.querySelector("#departureID").value;
    var arrivalID = document.querySelector("#arrivalID").value;
    const bestFlightsList = document.querySelector(".results-heading-best");
    const otherFlightsList = document.querySelector(".results-heading-other");

    if(data.best_flights){
        bestFlightsList.innerHTML = '';
        bestFlightsList.innerHTML =` 
            <div class="results-title">Top Flights</div>
            <div class="side-note">Ranked based on price and convenience - Only economy, single way, non-stop flights are shown</div>
            `;

        displayBestFlights(data, departureID, arrivalID);
    }

    if(data.other_flights){
        otherFlightsList.innerHTML = '';
        otherFlightsList.innerHTML =` 
        <div class="results-heading">
            <div class="results-title">Other Flights</div>
            <div class="side-note">Only economy, single way, non-stop flights are shown</div>
        </div>` ;

        displayOtherFlights(data, departureID, arrivalID);
    }
    document.querySelector(".results").scrollIntoView({ behavior: "smooth" });
}

function displayBestFlights(data, departureID, arrivalID){
    var flightsList = document.querySelector(".flights-list-best");
    flightsList.innerHTML = '';
    data.best_flights.forEach(flightData => {
        var flightLogo = flightData.flights[0].airline_logo;
        var airline = flightData.flights[0].airline;
        var price = flightData.price;
        var duration = flightData.total_duration;
        var arrivalTime = flightData.flights[0].arrival_airport.time;
        var departureTime = flightData.flights[0].departure_airport.time;
        var bookingToken = flightData.booking_token;

        var flightTime = formatFlightTime(departureTime, arrivalTime);
        var formattedDuration = formatDuration(duration);
        // var bookingLink = getBookingLink(bookingToken);

        var flightResult = `
            <li class="flight-info-container onclick="openBookingLink()">
                <img id="flight-logo" src="${flightLogo}" alt="${airline}">
                <div class="details-container">
                    <div class="details-1">${flightTime}</div>
                    <div class="details-2">${airline}</div>
                </div>
                <div class="details-container">
                    <div class="details-1">${formattedDuration}</div>
                    <div class="details-2">${departureID}-${arrivalID}</div>
                </div>
                <div class="details-container">
                    <div class="details-1">Non-Stop</div>
                </div>
                <div class="price">USD$${price}</div>
            </li>
        `;

        flightsList.innerHTML += flightResult;
    })
}

function displayOtherFlights(data, departureID, arrivalID) {
    var flightsList = document.querySelector(".flights-list-other");
    flightsList.innerHTML = '';
    data.other_flights.forEach(flightData => {
        var flightLogo = flightData.flights[0].airline_logo;
        var airline = flightData.flights[0].airline;
        var price = flightData.price;
        var duration = flightData.total_duration;
        var arrivalTime = flightData.flights[0].arrival_airport.time;
        var departureTime = flightData.flights[0].departure_airport.time;

        var flightTime = formatFlightTime(departureTime, arrivalTime);
        var formattedDuration = formatDuration(duration);

        var flightResult = `
            <li class="flight-info-container onclick="openBookingLink()">
                <img id="flight-logo" src="${flightLogo}" alt="${airline}">
                <div class="details-container">
                    <div class="details-1">${flightTime}</div>
                    <div class="details-2">${airline}</div>
                </div>
                <div class="details-container">
                    <div class="details-1">${formattedDuration}</div>
                    <div class="details-2">${departureID}-${arrivalID}</div>
                </div>
                <div class="details-container">
                    <div class="details-1">Non-Stop</div>
                </div>
                <div class="price">USD$${price}</div>
            </li>
        `;

        flightsList.innerHTML += flightResult;
    });
}

function formatFlightTime(depTime, arrTime){
    var formattedDepartureTime = depTime.split(' ')[1]; 
    var formattedArrivalTime = arrTime.split(' ')[1];

    var formattedOutput = formattedDepartureTime + " - " + formattedArrivalTime;

    return formattedOutput;
}

function formatDuration(duration) {
    var hours = Math.trunc(duration/60);
    var mins = duration - (60*hours);

    return (hours + " hr " + mins + " min");
}



// TODO

// async function getBookingLink(booking_token) {

//     try {
//         const response = await fetch(`${proxyUrl}?booking_token=${booking_token}`);
//         console.log(`Requesting booking link with URL: &booking_token=${booking_token}`);

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("booking options:");
//         console.log(data);
//     } catch (error){
//         console.error("Error fetching flight link:", error);
//         alert("An error occurred while fetching flight link. Please try again.");
//     }
// }


// function openBookingLink(url, booking_token) {

//     var newWindow = window.open(url, '_blank');
//     if (newWindow) {
//         newWindow.focus();
//     } else {
//         alert('Please allow popups for this website');
//     }
// }
