// Function to initialize the date picker
function initializeDatePicker() {
    const datepicker = document.getElementById("datepicker");
    // Set a default date for the date picker (e.g., today’s date)
    const today = new Date();
    const defaultDate = today.toISOString().split('T')[0];
    datepicker.value = defaultDate;
    datepicker.addEventListener("change", (event) => {
        fetchData();
    });
    // For simplicity, let’s use the built-in HTML5 date input
    // This will display a native date picker on supporting browsers
    datepicker.type = "date";
}

// Function to fetch data from the API and display it in the carousel
function fetchData() {
    var key = 'DhZgqHPR8sd2nvKgECz74jcTRRxDcioHOCvgtd7z';
    var datepicker = document.getElementById("datepicker");
    var selectedDate = datepicker.value;
    var getNeow = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${selectedDate}&end_date=${selectedDate}&api_key=${key}`;
    var getApod = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${selectedDate}`;
    const carouselDiv = document.getElementById("carousel");

    fetch(getNeow)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("NEOW Data:", data);
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
            var imgURL = data.url;
            var explan = data.explanation;
            var title = data.title;
            const img = document.createElement("img");
            img.src = imgURL;
            const explanationP = document.createElement("p");
            explanationP.textContent = explan;
            const titleHeader = document.createElement("h1");
            titleHeader.textContent = title;
            carouselDiv.innerHTML = ''; // Clear any existing content in the carousel
            carouselDiv.appendChild(img); // Append the image to the carousel
            carouselDiv.appendChild(titleHeader);
            carouselDiv.appendChild(explanationP); // Append the explanation paragraph to the carousel
        })
        .catch(function (error) {
            console.log("Error fetching APOD data:", error);
        });
}

// Call the function to initialize the date picker
initializeDatePicker();