// Sample images for the carousel
const carouselImages = [
    "image1.jpg",
    "image2.jpg",
    "image3.jpg",
    // Add more image filenames here...
];

// Function to create the carousel with images
function createCarousel() {
    const carouselDiv = document.querySelector(".carousel");

    carouselImages.forEach((image) => {
        const img = document.createElement("img");
        img.src = image;
        carouselDiv.appendChild(img);
    });

    let slideIndex = 0;

    function showSlide(index) {
        const slides = document.querySelectorAll(".carousel img");
        slides.forEach((slide) => (slide.style.display = "none"));
        slides[index].style.display = "block";
    }

    function nextSlide() {
        slideIndex++;
        if (slideIndex >= carouselImages.length) {
            slideIndex = 0;
        }
        showSlide(slideIndex);
    }

    // Set up the carousel to rotate images every 5 seconds
    setInterval(nextSlide, 5000);
}

// Function to initialize the date picker
function initializeDatePicker() {
    const datepicker = document.getElementById("datepicker");
    // You can use a date picker library or create a custom one here

    // For simplicity, let's use the built-in HTML5 date input
    // This will display a native date picker on supporting browsers
    datepicker.type = "date";
}

// Call the functions to create the carousel and initialize the date picker
createCarousel();
initializeDatePicker();


//CALLING APIS OF APOD AND NEOW
function fetchData() {

    var key = 'DhZgqHPR8sd2nvKgECz74jcTRRxDcioHOCvgtd7z';
    var getNeow = `https://api.nasa.gov/neo/rest/v1/feed?start_date=2017-08-11&end_date=2017-08-11&api_key=${key}`;
    
    fetch(getNeow)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
  }
    fetchData();
  
  
  function fetchData2() {
  
      var api_key = 'DhZgqHPR8sd2nvKgECz74jcTRRxDcioHOCvgtd7z';
      var getApod = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&start_date=2017-07-01&end_date=2017-07-11`;
      
      fetch(getApod)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
  }
    fetchData2();