// Class to make a carousel
class Carousel {
  constructor(selector) {
    this.slides = document.querySelectorAll(selector);
    this.currentSlideIndex = 0;
    this.showSlide();
    this.interval = null;
  }

  showSlide() {
    this.slides.forEach((slide, index) => {
      if (index === this.currentSlideIndex) {
        slide.style.display = 'block';
      } else {
        slide.style.display = 'none'
      }
    });
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    this.showSlide();
  }

  prevSlide() {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
    this.showSlide();
  }

  stopCarousel() {
    clearInterval(this.interval);
    this.interval = null;
  }

  startCarousel() {
    if (!this.interval) {
      this.interval = setInterval(() => this.nextSlide(), 3000);
      console.log('soy el intervalo empezando !!!')
    }
  }

  addEventListeners(nextButton, prevButton) {
    nextButton.addEventListener('click', () => {
      this.nextSlide()
      console.log('pa delante')
    });
    prevButton.addEventListener('click', () => {
      this.prevSlide()
      console.log('pa tras')
    });
  }
}


// Get local storage
function getLocalStorage() {
  let localStorageDate =  localStorage.getItem('dates');
  let dates = JSON.parse(localStorageDate);
  console.log(dates);
  return dates;
}

// Set date in local storage
function setLocalStorage(date) {
  let dateArray = JSON.parse(localStorage.getItem('dates')) || [];
  if (!dateArray.includes(date)) {
    console.log(dateArray.length);
    if (dateArray.length < 5) {
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
  datepicker.addEventListener('change', () => {
    setLocalStorage(datepicker.value);
    fetchApod(datepicker.value);
    fetchNeow(datepicker.value);
  });
}

// Function to fetch data from the API APOD and display it in the carousel
function fetchApod(date) {
  const key = 'DhZgqHPR8sd2nvKgECz74jcTRRxDcioHOCvgtd7z';
  let getApod = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${date}`;
  fetch(getApod)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("APOD Data:", data);
      // carouselElement(data);
      // carouselFromStorage(data);
      return data;

    })
    .catch(function (error) {
      console.log("Error fetching APOD data:", error);
    });
}

// Function to fetch data from the API NEOW and display it
function fetchNeow(date) {
  const key = 'DhZgqHPR8sd2nvKgECz74jcTRRxDcioHOCvgtd7z';
  let getNeow = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${key}`;
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
}


// Creates an element for the carrusel
function apodElement(dataApod) {
  const carouselElement = document.getElementById('carousel');
  const carouselDiv = document.createElement('div');
  carouselDiv.classList.add('carouselDiv');
  carouselDiv.innerHTML = `
        <h2>${dataApod.title}</h2>
        <img src="${dataApod.url}" alt="${dataApod.title}">
        <p>${dataApod.explanation}</p>        
    `;
  
  carouselElement.appendChild(carouselDiv);
}

// Creates an element for the facts
function factOfTheDay(dataNeow) {
  let date = Object.keys(dataNeow.near_earth_objects)[0]; // date
  let numberElements = dataNeow.element_count; // near earth objects
  const factElement = document.getElementById('fact');
  const factDiv = document.createElement('div');
  factDiv.classList.add('factDiv');
  factDiv.innerHTML = `
        <h2>Fact</h2>
        <p>On this day, ${date}, ${numberElements} near earth objects where detected.</p>
    `
  factElement.textContent = '';
  factElement.appendChild(factDiv);
}

// Make a new instance of the class Carousel
const carouselDataApod = new Carousel('.carouselDiv');

const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');
carouselDataApod.addEventListeners(nextButton, prevButton);

// Call the function to initialize the date picker
initializeDatePicker();

function carouselFromStorage() {
  let arrayDates = getLocalStorage();

  // Create an array of promises for all the fetch requests
  const fetchPromises = arrayDates.map((date) => fetchApod(date));

  // Use Promise.all to wait for all the fetch requests to complete before appending elements to the carousel
  Promise.all(fetchPromises)
    .then((results) => {
      // Append fetched elements to the carousel
      results.forEach((data) => {
        apodElement(data);
      });

      // Start the existing carousel instance
      carouselDataApod.startCarousel();
    })
    .catch((error) => {
      console.log("Error fetching carousel elements:", error);
    });
}

carouselFromStorage()