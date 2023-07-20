// Function to initialize the date picker
function initializeDatePicker() {
  const datepicker = document.getElementById("datepicker");

  // Set a default date for the date picker (e.g., today's date)
  const today = new Date();
  const defaultDate = today.toISOString().split('T')[0];
  datepicker.value = defaultDate;

  datepicker.addEventListener("change", (event) => {
      fetchData();
  });

  // For simplicity, let's use the built-in HTML5 date input
  // This will display a native date picker on supporting browsers
  datepicker.type = "date";
}

// Call the functions to create the carousel and initialize the date picker
createCarousel();
initializeDatePicker();

// Sample images for the carousel
var carouselImages= src="data.url";

// Function to create the carousel with images
function createCarousel() {
  // ... your carousel creation code ...
}

//CALLING APIS OF APOD AND NEOW
function fetchData() {
  var key = 'DhZgqHPR8sd2nvKgECz74jcTRRxDcioHOCvgtd7z';
  var datepicker = document.getElementById("datepicker");
  var selectedDate = datepicker.value;

  var getNeow = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${selectedDate}&end_date=${selectedDate}&api_key=${key}`;
  var getApod = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${selectedDate}`;

  var carouselDiv = document.querySelector(".carousel");

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
          var imgTitle = document.createElement("h3");
          var imgExplanation = document.createElement("h4");
          var img = document.createElement("img");
          img.src = imgURL;
          console.log(img);
          carouselDiv.innerHTML = ''; // Clear any existing images in the carousel
          imgTitle.innerText = data.title;
          imgExplanation.innerText = data.explanation;
          imgTitle.className = 'title';
          imgExplanation.className = 'explanation';
          carouselDiv.appendChild(img);
          carouselDiv.appendChild(imgTitle);
          carouselDiv.appendChild(imgExplanation);
          
      })
      .catch(function (error) {
          console.log("Error fetching APOD data:", error);
      });
          
    };