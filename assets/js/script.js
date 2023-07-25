const datepicker = document.getElementById("datepicker");
const newDateBox = document.querySelector("#newDateBox");
const todaysPic = document.querySelector('#todaysPic');
const errorMsg = document.querySelector("#errorMsg");
const carouselDiv = document.querySelector(".carousel");

const mainContent = $("#mainContent");
const yourDayBox = $("#yourDayBox");
const key = 'DhZgqHPR8sd2nvKgECz74jcTRRxDcioHOCvgtd7z'; // As a global variable.

let myDatesArray = []; // The bookmarks array as a global variable.

// To be called each time we need to update the local storage.
const storeData = () => localStorage.setItem("myDates", JSON.stringify(myDatesArray));
// To access the local storage.
const getData = () => {
    myDatesArray = JSON.parse(localStorage.getItem("myDates")); 
};

// To be called every time the site is loaded and download the local storage or set a new item if it's empty.
const getSavedDates = () => {
    if (localStorage.getItem("myDates") === null) {
        storeData(); 
    } else {
        getData(); 
    };
};

function createCarousel() {
  getData ();

  carouselDiv.innerHTML = ""; // Clear existing carousel content

  // Create an array of promises for each fetchImageForDate call
  var promises = myDatesArray.map(function (date) {
    return fetchImageForDate(date);
  });

  // Resolve all promises and append the images to the carousel
  Promise.all(promises)
    .then(function (imageUrls) {
      imageUrls.forEach(function (imageUrl) {
        var img = document.createElement("img");
        img.src = imageUrl;
        img.style.display = "none"; // Hide the image initially
        carouselDiv.appendChild(img);
      });

      // Display the first image
      var firstImage = carouselDiv.querySelector("img");
      if (firstImage) {
        firstImage.style.display = "block";
      }
    });
}

function saveSelectedDate(date) {
  getData ();
  
  if (myDatesArray.length >= 5) {
    myDatesArray.pop(); // Remove the last date if there are already 5 dates
  }
  myDatesArray.unshift(date); // Add the new date to the beginning of the array
  storeData();
  //duda de si tengo que llamar fetchdata....
}
// Function to update date buttons in the carousel
function updateDateButtons() {
  var myDatesArray = JSON.parse(localStorage.getItem("selectedDates")) || [];
  var buttonsContainer = document.querySelector(".buttons-container");
  buttonsContainer.innerHTML = ""; // Clear existing buttons

  if (myDatesArray.length === 0) {
    return; // Don't show buttons if no date is selected
  }

  myDatesArray.forEach(function (date, index) {
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
  if (!prevButton && !nextButton && myDatesArray.length > 0) {
    initializeNavigationButtons();
  }
}

// Function to initialize previous and next buttons
function initializeNavigationButtons() {
  var prevButton = document.createElement("button");
  var nextButton = document.createElement("button");
  var buttonsContainer = document.querySelector(".buttons-container");
  var // Function to initialize previous and next buttons
function initializeNavigationButtons() {
  var prevButton = document.createElement("button");
  var nextButton = document.createElement("button");
  var buttonsContainer = document.querySelector(".buttons-container");
  var myDatesArray = JSON.parse(localStorage.getItem("selectedDates")) || [];

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
    if (currentIndex >= myDatesArray.length) {
      currentIndex = myDatesArray.length - 1;
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

    if (index === myDatesArray.length - 1) {
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
} }

//--------------------------------------------------------------------

// Function to add the initial event listeners as the page loads.
function eventListenersFunc () {
    datepicker.addEventListener("change", fetchDataFuncInput);  // For the type-date input.
    todaysPic.addEventListener("click", fetchDataFuncToday);    // For the today's pic button.
}

// To fetch data from the API and render a new box when the user selects a date in the input.
const fetchDataFuncInput = () => {
    let selectedDate = datepicker.value;
    
    // Error message for if the user selects an invalid date.
    if (selectedDate >= '1995-06-24' && selectedDate <= dayjs().format('YYYY-MM-DD')) {
        renderDayBox();
        fetchData(selectedDate);
    } else {
        errorMsgHideShow();
        setTimeout(errorMsgHideShow, 5000);
    };
};

// If the error message is shown, hide it; if hidden, show it.
const errorMsgHideShow = () => {
    if (errorMsg.dataset.state == "hidden") {
        errorMsg.dataset.state = "shown";
        errorMsg.classList.remove("hidden");
    } else {
        errorMsg.dataset.state = "hidden";
        errorMsg.classList.add("hidden");
    }
}

// Shows the picture of the day.
const fetchDataFuncToday = () => {
    let today = dayjs().format('YYYY-MM-DD') ;
    // Hiddes the date selector input.
    
    $('#yourDayBox').remove();
    renderDayBox();
    fetchData(today);
};

// Added a parameter to the function to have various input sources.
function fetchData(inputDate) {
    
    var getNeow = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${inputDate}&end_date=${inputDate}&api_key=${key}`;
    var getApod = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${inputDate}`;

    fetch(getApod)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // console.log("APOD Data:", data);
        let imgURL = data.url;
        let explan = data.explanation;
        let title = data.title;
        
        // A box is rendered solely for the APOD data.
        renderPicBox(imgURL, title, explan); 
    })
    .catch(function (error) {
        console.log("Error fetching APOD data:", error);
    });

    fetch(getNeow)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        // console.log("NEOW Data:", data);
        let neos = data.near_earth_objects[inputDate]; // To access the data object property by name and create a new array from the fetched data.
        let neoCount = neos.length;

        // A box is rendered solely for the NeoWs data.
        renderNeoBox(inputDate, neos, neoCount);
    })
    .catch(function (error) {
        console.log("Error fetching NEOW data:", error);
    })
};

// To create a new section to contain the data box.
const renderDayBox = () => {
    const yourDayBox = $(`<section id="yourDayBox" class="flex-col items-center justify-center"></section>`);

    // Apended to the main section of the body.
    mainContent.append(yourDayBox);
};

// Hiddes the date selector and renders a new box with all its elements from scratch, just for the APOD data.
const renderPicBox = (pic, picTitle, picExplan) => {

    dateBoxHide();

    // Creates the DOM element with all its children, classes, and ids based on the input data.
    const picBox = $(`
        <div id="picBox" class="flex flex-col items-center justify-between bg-black/50 backdrop-blur-md p-8 pb-16 max-w-4xl w-fit border border-gray-200 rounded-t-2xl">
            <h1 class="text-3xl font-bold font-brand text-gray-200 mb-8 text-center">YOUR MEANINGFUL DAY PIC</h1>
            <div class="relative flex justify-center items-center">
                <img id="picAstro" class="mb-6" src="${pic}" alt="${picTitle}">
                <h1 id="saved" class="absolute bg-gray-400/30 rounded-lg py-10 px-20 text-3xl font-bold font-brand text-gray-200 opacity-0">SAVED</h1>
            </div>
            <p class="h-32 overflow-auto m-0 font-body text-gray-200 bg-black/50 p-5 rounded-lg">${picTitle} <br><br>
                ${picExplan}
            </p>
        </div>
    `);

    // Apendded to the section recently created.
    $('#yourDayBox').append(picBox);
};

// Renders a new box positioned under the APOD box with all its elements from scratch, just for the NeoWs data.
const renderNeoBox = (inputDate, neos, neoCount) => {

    let neoLiElements = ""; // To define the new DOM's elements as a string for further appending. (ul of Neos)

    // Loop to debug and create a strig able to be concatenated with the URL of NASA's Eyes on Asteroids Website.
    // For example – The format given is: 154278 (2002 TB9), and we need: 154278_2002_TB9.
    for (i = 0; i < neoCount; i++) {
        let neoName = neos[i].name // To select each asteroid name by object's property, one by one.
        let neoNameClean = neoName.replace('(', '').replace(')', '').replace('/', '_').replace('-', '_').replace(' ', '_').replace(' ', '_').replace('__', '_');

        // The format has to be all lowercase.
        let neoCode = neoNameClean.toLowerCase();

        // New string concatenated to the new li elements.
        neoLiElements += `<li>${i + 1}: ${neoName} <a class="underline" href="https://eyes.nasa.gov/apps/asteroids/#/asteroids/${neoCode}" target="_blank">Live Location</a></li>`;
    };

    // Create the complete box of Neos under the picture box.
    const neoBox = $(`
        <div id="neoBox" class="flex flex-col items-center justify-between bg-black/50 backdrop-blur-md p-8 pt-16 max-w-4xl w-fit border border-t-0 border-gray-200 rounded-b-2xl mb-10">
            <h1 class="text-3xl font-bold font-brand text-gray-200 mb-8 text-center">THE NEAR EARTH OBJECTS OF YOUR MEANINGFUL DAY</h1>
            <div id="neosDiv" class="h-40 overflow-auto m-0 font-body text-gray-200 bg-black/50 p-5 rounded-lg">
                <p>That day, there were ${neoCount} objects found nearby! <br>
                Click on the links to see your nearby objects and their live locations across the solar system!</p>
                <br>
                <ul id="neosList">
                    ${neoLiElements}
                </ul>
            </div>


            <div class="flex justify-between mt-8">
                <button id="btnSave" class="btn bg-gray-200/30 hover:bg-slate-500/30 py-1 px-5 mx-5 text-xl font-brand font-black text-gray-200 rounded-lg">SAVE</button>
                <button id="btnClose" class="btn bg-gray-200/30 hover:bg-slate-500/30 py-1 px-5 mx-5 text-xl font-brand font-black text-gray-200 rounded-lg">CLOSE</button>
            </div>
        </div>
    `);

    // Appended to the box.
    $('#yourDayBox').append(neoBox);
    const savedMsg = $('#saved'); // Save message defined.
    
    // Function to save the data after clicking the save button.
    const saveDate = () => {
        savedMsg.addClass('opacity-100');
        const remSaveMsg = () => {
            savedMsg.addClass('trans-6s');
            savedMsg.removeClass('opacity-100');
        };

        let dateFinder = myDatesArray.find(element => element == inputDate);

        if (dateFinder == undefined) {
            myDatesArray.push(inputDate);
            storeData();
        }

        setTimeout(remSaveMsg, 1000);
        
        neoBox.off('click', '#btnSave', saveDate);
    };

    // Function to close everything after clicking the close button and returning to default view with date picker.
    const closeBox = () => {
        $('#yourDayBox').remove();
        dateBoxShow();
    };

    // Event callers for save and close buttons.
    neoBox.on('click', '#btnClose', closeBox);
    neoBox.on('click', '#btnSave', saveDate);
};

// Function to be called for showing the date picker box.
const dateBoxShow = () => {    
    newDateBox.classList.remove("hidden");
    newDateBox.dataset.state = "visible";    
};

// Function to be called for hiding the date picker box.
const dateBoxHide = () => {    
    newDateBox.classList.add("hidden");
    newDateBox.dataset.state = "hidden";
};

// To set the HTML attribute of 'max' for the type=date input.
const setMaxDate = () => {
    let todaysDay = dayjs().format('YYYY-MM-DD');
    $('#datepicker').attr("max", todaysDay);
};

// Function to define the actual date for the Today's Pic button.
const todaysDate = () => {
    const today = $(".todaysDate");
    let todaysDay = dayjs().format('D MMM');

    today.html(todaysDay);
};

// Function to be executed after loading the site.
$(document).ready(function() {
    setMaxDate();
    todaysDate();
    eventListenersFunc();
    getSavedDates();

  
    setInterval(() => {
      todaysDate();
  
    }, 3600000);
});







// Call the function to initialize the date picker

// const img = document.createElement("img");
// img.src = imgURL;
// const explanationP = document.createElement("p");
// explanationP.textContent = explan;
// const titleHeader = document.createElement("h1");
// titleHeader.textContent = title;
// carouselDiv.innerHTML = ''; // Clear any existing content in the carousel
// carouselDiv.appendChild(img); // Append the image to the carousel
// carouselDiv.appendChild(titleHeader);
// carouselDiv.appendChild(explanationP); // Append the explanation paragraph to the carousel