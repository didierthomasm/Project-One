// Function to fetch image URL for a given date
async function fetchImageForDate(date) {
  var apiKey = 'DhZgqHPR8sd2nvKgECz74jcTRRxDcioHOCvgtd7z';
  var apodUrl = 'https://api.nasa.gov/planetary/apod?api_key=' + apiKey + '&date=' + date;

  var response = await fetch(apodUrl);
  var data = await response.json();
  return data.url;
}

// Function to create the carousel with images
async function createCarousel() {
  var carouselDiv = document.querySelector(".carousel");
  var dates = JSON.parse(localStorage.getItem("selectedDates")) || [];

  carouselDiv.innerHTML = ""; // Clear existing carousel content

  for (var date of dates) {
    var imageUrl = await fetchImageForDate(date);
    var img = document.createElement("img");
    img.src = imageUrl;
    img.style.display = "none"; // Hide the image initially
    carouselDiv.appendChild(img);
  }

  // Display the first image
  var firstImage = carouselDiv.querySelector("img");
  if (firstImage) {
    firstImage.style.display = "block";
  }
}

// Function to initialize the date picker
function initializeDatePicker() {
  var datepicker = document.getElementById("datepicker");
  datepicker.type = "date";

  datepicker.addEventListener("change", function () {
    var selectedDate = this.value;
    if (selectedDate) {
      saveSelectedDate(selectedDate);
      updateDateButtons();
      fetchData(); // Call fetchData whenever a date is selected
    }
  });
}

// Function to save selected date to local storage
function saveSelectedDate(date) {
  var dates = JSON.parse(localStorage.getItem("selectedDates")) || [];
  if (dates.length >= 5) {
    dates.pop(); // Remove the last date if there are already 5 dates
  }
  dates.unshift(date); // Add the new date to the beginning of the array
  localStorage.setItem("selectedDates", JSON.stringify(dates));
}

// Function to update date buttons in the carousel
function updateDateButtons() {
  var dates = JSON.parse(localStorage.getItem("selectedDates")) || [];
  var buttonsContainer = document.querySelector(".buttons-container");
  buttonsContainer.innerHTML = ""; // Clear existing buttons

  if (dates.length === 0) {
    return; // Don't show buttons if no date is selected
  }

  dates.forEach(function (date, index) {
    var button = document.createElement("button");
    button.textContent = date;
    button.classList.add("date-button");
    buttonsContainer.appendChild(button);

    button.addEventListener("click", function () {
      showImageForDate(date); // Call the function to show the image for the selected date
    });
  });

  // Refresh the carousel images with updated dates
  createCarousel();

  // Append prev and next buttons after selecting a date
  var prevButton = document.querySelector(".prev-button");
  var nextButton = document.querySelector(".next-button");
  if (!prevButton && !nextButton && dates.length > 0) {
    initializeNavigationButtons();
  }
}

// Function to initialize previous and next buttons
function initializeNavigationButtons() {
  var prevButton = document.createElement("button");
  var nextButton = document.createElement("button");
  var buttonsContainer = document.querySelector(".buttons-container");
  var dates = JSON.parse(localStorage.getItem("selectedDates")) || [];

  var currentIndex = 0;
  updateSlide(currentIndex);

  prevButton.textContent = "<";
  prevButton.classList.add("prev-button");
  nextButton.textContent = ">";
  nextButton.classList.add("next-button");

  prevButton.addEventListener("click", function () {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = 0;
    }
    updateSlide(currentIndex);
  });

  nextButton.addEventListener("click", function () {
    currentIndex++;
    if (currentIndex >= dates.length) {
      currentIndex = dates.length - 1;
    }
    updateSlide(currentIndex);
  });

  function updateSlide(index) {
    var buttons = document.querySelectorAll(".date-button");
    buttons.forEach(function (button) {
      return button.classList.remove("active");
    });
    if (buttons[index]) {
      buttons[index].classList.add("active");
    }

    var images = document.querySelectorAll(".carousel img");
    images.forEach(function (img) {
      return (img.style.display = "none");
    }); // Hide all images

    if (images[index]) {
      images[index].style.display = "block"; // Show the selected image
    }

    if (index === dates.length - 1) {
      nextButton.style.display = "none";
    } else {
      nextButton.style.display = "block";
    }
    if (index === 0) {
      prevButton.style.display = "none";
    } else {
      prevButton.style.display = "block";
    }
  }

  buttonsContainer.appendChild(prevButton);
  buttonsContainer.appendChild(nextButton);
}

// Function to fetch data and handle the response
function fetchData() {
  var key = 'DhZgqHPR8sd2nvKgECz74jcTRRxDcioHOCvgtd7z';
  var selectedDate = document.getElementById("datepicker").value;
  var getNeow = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=' + selectedDate + '&end_date=' + selectedDate + '&api_key=' + key;
  var getApod = 'https://api.nasa.gov/planetary/apod?api_key=' + key + '&date=' + selectedDate;

  // Fetch APOD data and handle the response
  fetch(getApod)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // No need to call createCarousel(), initializeDatePicker(), and initializeNavigationButtons() here
    });

  // Fetch NEOW data and handle the response
  fetch(getNeow)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // No need to call createCarousel(), initializeDatePicker(), and initializeNavigationButtons() here
    });
}

// Call the functions to initialize the date picker and buttons
initializeDatePicker();
