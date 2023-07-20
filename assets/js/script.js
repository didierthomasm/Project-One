<<<<<<< Updated upstream
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
=======
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const slideshowImage = document.getElementById("slideshow-image");
    const datepicker = document.getElementById("datepicker");

    function showCarousel() {
        carousel.style.display = "flex";
    }

    function hideCarousel() {
        carousel.style.display = "none";
    }

    function loadSlideshowImage(imageSrc) {
        slideshowImage.src = imageSrc;
        showCarousel(); 
    }
>>>>>>> Stashed changes

    function createCarousel() {
        // ... your carousel creation code ...
    }

<<<<<<< Updated upstream

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
      })
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
=======
    function initializeDatePicker() {
        const today = new Date();
        const defaultDate = today.toISOString().split('T')[0];
        datepicker.value = defaultDate;

        datepicker.addEventListener("change", () => {
            fetchData();
        });

        // For simplicity, let's use the built-in HTML5 date input
        // This will display a native date picker on supporting browsers
        datepicker.type = "date";
    }

    // Function to fetch data from APIs and update the carousel
    function fetchData() {
        var key = 'DhZgqHPR8sd2nvKgECz74jcTRRxDcioHOCvgtd7z';
        var selectedDate = datepicker.value;

        var getNeow = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${selectedDate}&end_date=${selectedDate}&api_key=${key}`;
        var getApod = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${selectedDate}`;

        const carouselDiv = document.querySelector(".carousel");

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
                const img = document.createElement("img");
                img.src = imgURL;
                const explanationP = document.createElement("p");
                explanationP.textContent = explan;

                carouselDiv.innerHTML = ''; // Clear any existing content in the carousel
                carouselDiv.appendChild(img); // Append the image to the carousel
                carouselDiv.appendChild(explanationP); // Append the explanation paragraph to the carousel
                loadSlideshowImage(imgURL); // Load the image into the carousel
            })
            .catch(function (error) {
                console.log("Error fetching APOD data:", error);
                hideCarousel(); // Hide the carousel buttons and the image in case of an error.
            });
    }

    // Call the functions to create the carousel and initialize the date picker
    createCarousel();
    initializeDatePicker();

    // Event listeners for carousel buttons
    prevBtn.addEventListener("click", () => {
        // Implement the logic to show the previous image in the carousel.
        // This code is left empty for you to fill in.
    });

    nextBtn.addEventListener("click", () => {
        // Implement the logic to show the next image in the carousel.
        // This code is left empty for you to fill in.
    });
});
>>>>>>> Stashed changes
