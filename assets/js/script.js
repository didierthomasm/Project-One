// Get local storage
function getLocalStorage() {
    let localStorageDate =  localStorage.getItem('dates');
    let dates = JSON.parse(localStorageDate);
    console.log(dates);
}

getLocalStorage();

// Set date in local storage
function setLocalStorage(date) {
    let dateArray = JSON.parse(localStorage.getItem('dates')) || [];
    if (!dateArray.includes(date)) {
        console.log(dateArray.length);
        if (dateArray.length < 5) {
            console.log(`Estoy a tope, no me eches más... borra uno antes ${dateArray}`)
            dateArray.push(date);
            localStorage.setItem('dates', JSON.stringify(dateArray));
        }
    }
}

// Function to initialize the date picker
function initializeDatePicker() {
    const datepicker = document.getElementById("datepicker");
    // Set a default date for the date picker (e.g., today’s date)
    datepicker.value = new Date().toISOString().split('T')[0];
    datepicker.addEventListener("change", () => {
        setLocalStorage(datepicker.value);
        fetchData(datepicker.value);
    });
    // For simplicity, let’s use the built-in HTML5 date input
    // This will display a native date picker on supporting browsers
    datepicker.type = "date";
}

// Function to fetch data from the API and display it in the carousel
function fetchData(date) {
    const key = 'DhZgqHPR8sd2nvKgECz74jcTRRxDcioHOCvgtd7z';
    let getNeow = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${key}`;
    let getApod = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${date}`;

    fetch(getNeow)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("NEOW Data:", data);
            factOfTheDay(data);
            return data;
        })
        .catch(function (error) {
            console.log("Error fetching NEOW data:", error);
        });

    fetch(getApod)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("APOD Data:", data);
            carruselElement(data);
            return data;

        })
        .catch(function (error) {
            console.log("Error fetching APOD data:", error);
        });
}

function carruselElement(dataApod) {
    const carouselElement = document.getElementById("carousel");
    
    const carruselDiv = document.createElement('div');
    carruselDiv.classList.add('carruselDiv');
    carruselDiv.innerHTML = `
        <h2>${dataApod.title}</h2>
        <img src="${dataApod.url}" alt="${dataApod.title}">
        <p>${dataApod.explanation}</p>        
    `
    carouselElement.innerHTML = ''; // Clear any existing content in the carousel
    carouselElement.appendChild(carruselDiv);
}

function factOfTheDay(dataNeow) {
    
}

// Call the function to initialize the date picker
initializeDatePicker();