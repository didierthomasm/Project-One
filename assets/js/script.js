const datepicker = document.getElementById("datepicker");
const datepickerMobile = document.getElementById("datepickerMobile");
const fluxCap = document.getElementById("flux-capacitor");
const newDateBox = document.querySelector("#newDateBox");
const todaysPic = document.querySelector('#todaysPic');
const errorMsg = document.querySelector("#errorMsg");
const myDatesBtn = document.querySelector("#myDatesBtn");
const emptyMsg = document.querySelector("#emptyMsg");
const carousel = document.querySelector("#carousel");
constbtnOk = document.querySelector("#btnOk")
const bookmarkZone = $("#bookmarkZone");
const mainContent = $("#mainContent");
// As a global variable.
const key = 'DhZgqHPR8sd2nvKgECz74jcTRRxDcioHOCvgtd7z';

datepickerMobile.defaultValue = '1999-12-31';

// The bookmarks array as a global variable.
let myDatesArray = [];

// To be called each time we need to update the local storage.
const storeData = () => localStorage.setItem("myDates", JSON.stringify(myDatesArray));
// To access the local storage.
const getData = () => {
    myDatesArray = JSON.parse(localStorage.getItem("myDates"));
};

// After being called by clicking My Dates button, it shows the My Dates carousel.
const openMyDates = (e) => {
    e.stopPropagation();
    // My Saves Btn now disabled.
    myDatesBtn.removeEventListener('click', openMyDates);
    // This class just changes height, from 0vh to 20vh.
    carousel.classList.add('carousel-shown');
    // A click event for the whole document.
    document.addEventListener('click', closeMyDates);
};

// After being called by clicking anywhere outside the carousel, it closes the My Dates carousel.
const closeMyDates = (e) => {
    let event = !carousel.contains(e.target); // A click

    if (event) {
        carousel.classList.remove('carousel-shown');
        myDatesBtn.addEventListener('click', openMyDates);
    }
};

// To be called every time the site is loaded and download the local storage or set a new item if it's empty.
const getSavedDates = () => {
    if (localStorage.getItem("myDates") === null) {
        storeData();
    } else {
        getData();
    };
};

// Function to add the initial event listeners as the page loads.
const eventListenersFunc = () => {
    // For the type-date input.
    datepicker.addEventListener("change", fetchDataFuncInput);
    // For the today's pic button.
    todaysPic.addEventListener("click", fetchDataFuncToday);
    // To open the bookmarks (My Dates).
    myDatesBtn.addEventListener("click", openMyDates);
    // For the type-date input on mobile.
    fluxCap.addEventListener("click", fetchDataFuncInputMobile);
    // To hide error message.
    btnOk.addEventListener("click", errorMsgHide);
};

// To fetch data from the APIs and render a new box when the user selects a date on the mobile input.
const fetchDataFuncInputMobile = (e) => {
    // To prevent from closing My Dates carousel when open.
    e.stopPropagation();
    let selectedDate = datepickerMobile.value;

    // Error message for if the user selects an invalid date.
    if (selectedDate >= '1995-06-24' && selectedDate <= dayjs().format('YYYY-MM-DD')) {
        renderDayBox();
        fetchData(selectedDate);
    } else {
        errorMsgHideShow();
        setTimeout(errorMsgHideShow, 5000);
    }
};

// To fetch data from the APIs and render a new box when the user selects a date on the input.
const fetchDataFuncInput = (e) => {
    // To prevent from closing My Dates carousel when open.
    e.stopPropagation();
    let selectedDate = datepicker.value;

    // Error message for if the user selects an invalid date.
    if (selectedDate >= '1995-06-24' && selectedDate <= dayjs().format('YYYY-MM-DD')) {
        renderDayBox();
        fetchData(selectedDate);
    } else {
        errorMsgShow();
    };
};

const errorMsgShow = () => {
    errorMsg.classList.remove("hidden");
    errorMsg.classList.add("flex");
};

// If the error message is shown, hide it; if hidden, show it.
const errorMsgHide = () => {
    errorMsg.dataset.state = "hidden";
    errorMsg.classList.add("hidden");
    errorMsg.classList.remove("flex");
};

// Shows the picture of the day.
const fetchDataFuncToday = (e) => {
    // To prevent from closing My Dates carousel when open.
    e.stopPropagation();
    let today = dayjs().format('YYYY-MM-DD') ;

    // Removes any active DayBox present to open a new one.
    $('#yourDayBox').remove();
    renderDayBox();
    fetchData(today);
};

// To fetch data from the APIs and render a new box when the user selects a bookmark (saved date).
const fetchDataFuncBookmark = (e) => {
    // To prevent from closing My Dates carousel when open.
    e.stopPropagation();
    let event = e.target;
    // Each bookmark has a date saved as a data-date attribute.
    let BMDate = event.dataset.date;

    // Removes any active DayBox present to open a new one.
    $('#yourDayBox').remove();
    renderDayBox();
    fetchData(BMDate);
};

// Func to run the remove button from the bookmarks.
const deleteBookmark = (e) => {
    e.stopPropagation();
    let event = e.target;

    event.parentElement.remove(); // Removes the whole bookmark element.
    myDatesArray.splice(event.dataset.index, 1); // To erase from the saved dates array from a specific position.
    storeData(); // To update the local storage.
};

// Func called after loading the site and after making changes to saved dates.
const renderCarousel = () => {

    // To render bookmarks only if the local storage isn't empty.
    if (myDatesArray.length > 0) {
        for (i = 0; i < myDatesArray.length; i++) {
            if (myDatesArray[i].p.search("youtube") < 0) {
                const bookmark = $(`
                <div id="bookmark" class="flex flex-col items-center justify-between h-4/5 aspect-square mx-12" data-index="${i}">
                    <div id="bookmarkImg" class="w-4/6 h-4/6 aspect-square bg-cover rounded-full border glow-light" style="background-image: url(${myDatesArray[i].p});" data-date="${myDatesArray[i].d}"></div>
                    <p class="font-pixels text-xs text-gray-200 h-1/6 flex items-center">${myDatesArray[i].d}</p>
                    <button id="btnRemove" class="btn bg-gray-200/30 hover:bg-red-500/30 px-5 mx-5 text-xs font-brand font-black text-gray-200 rounded-md" data-index="${i}">REMOVE</button>
                </div>
                `);
                bookmarkZone.append(bookmark);
                bookmark.on('click', '#btnRemove', deleteBookmark); // To activate the REMOVE button.
                bookmark.on('click', '#bookmarkImg', fetchDataFuncBookmark); // To render the saved bookmark.
            } else {
                const bookmark = $(`
                <div id="bookmark" class="flex flex-col items-center justify-between h-4/5 aspect-square mx-12" data-index="${i}">
                    <div id="bookmarkImg" class="w-4/6 h-4/6 aspect-square bg-cover rounded-full border glow-light" style="background-image: url(https://i.blogs.es/9b19ad/youtube/1366_2000.webp); background-position: center;" data-date="${myDatesArray[i].d}"></div>
                    <p class="font-pixels text-xs text-gray-200 h-1/6 flex items-center">${myDatesArray[i].d}</p>
                    <button id="btnRemove" class="btn bg-gray-200/30 hover:bg-red-500/30 px-5 mx-5 text-xs font-brand font-black text-gray-200 rounded-md" data-index="${i}">REMOVE</button>
                </div>
                `);
                bookmarkZone.append(bookmark);
                bookmark.on('click', '#btnRemove', deleteBookmark); // To activate the REMOVE button.
                bookmark.on('click', '#bookmarkImg', fetchDataFuncBookmark); // To render the saved bookmark.
            };
        };
    } else {
        // To display a message if the local storage is empty.
        emptyMsg.classList.remove('hidden');
        // To align the message.
        carousel.classList.remove('justify-start');
        carousel.classList.add('justify-center');
    };
};

// Added a parameter to the function to have various input sources.
const fetchData = (inputDate) => {

    const getNeow = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${inputDate}&end_date=${inputDate}&api_key=${key}`;
    const getApod = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${inputDate}`;
    let imgURL = "";

    fetch(getApod)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          // console.log("APOD Data:", data);
          imgURL = data.url;
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
          renderNeoBox(inputDate, neos, neoCount, imgURL);
      })
      .catch(function (error) {
          console.log("Error fetching NEOW data:", error);
      });
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
    if (pic.search("youtube") < 0) {
        const picBox = $(`
            <div id="picBox" class="flex flex-col items-center justify-between bg-black/50 backdrop-blur-md p-4 pb-8 md:p-8 md:pb-16 mx-3 max-w-4xl w-fit border border-gray-200 rounded-t-2xl">
                <h1 class="text-xl md:text-3xl font-bold font-brand text-gray-200 mb-4 md:mb-8 text-center">YOUR MEANINGFUL DAY PIC</h1>
                <div class="relative flex justify-center items-center">
                    <img id="picAstro" class="mb-6" src="${pic}" alt="${picTitle}">
                    <h1 id="saved" class="absolute bg-gray-400/30 rounded-lg py-10 px-20 text-3xl font-bold font-brand text-gray-200 opacity-0">SAVED</h1>
                </div>
                <p class="text-sm md:text-base h-32 overflow-auto m-0 font-body text-gray-200 bg-black/50 p-5 rounded-lg">${picTitle}<br><br>
                    ${picExplan}
                </p>
            </div>`
        );
        // Apendded to the section recently created.
        $('#yourDayBox').append(picBox);
    } else {
        const picBox = $(`
            <div id="picBox" class="flex flex-col items-center justify-between bg-black/50 backdrop-blur-md p-4 pb-8 md:p-8 md:pb-16 mx-3 max-w-4xl w-fit border border-gray-200 rounded-t-2xl">
                <h1 class="text-xl md:text-3xl font-bold font-brand text-gray-200 mb-4 md:mb-8 text-center">YOUR MEANINGFUL DAY VIDEO</h1>
                <div class="relative flex justify-center items-center">
                    <iframe width="560" height="315" id="picAstro" class="mb-6" src="${pic}" title="${picTitle}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <p class="text-sm md:text-base h-32 overflow-auto m-0 font-body text-gray-200 bg-black/50 p-5 rounded-lg">${picTitle}<br><br>
                    ${picExplan}
                </p>
            </div>`
        );

        // Apendded to the section recently created.
        $('#yourDayBox').append(picBox);
    }
};

// Renders a new box positioned under the APOD box with all its elements from scratch, just for the NeoWs data.
const renderNeoBox = (inputDate, neos, neoCount, imgURL) => {
    // To define the new DOM's elements as a string for further appending. (ul of Neos)
    let neoLiElements = "";

    // Loop to debug and create a strig able to be concatenated with the URL of NASA's Eyes on Asteroids Website.
    // For example – The format given is: 154278 (2002 TB9), and we need: 154278_2002_TB9.
    for (i = 0; i < neoCount; i++) {
        // To select each asteroid name by object's property, one by one.
        let neoName = neos[i].name;
        let neoNameClean = neoName.replace('(', '').replace(')', '').replace('/', '_').replace('-', '_').replace(' ', '_').replace(' ', '_').replace('__', '_');

        // The format has to be all lowercase.
        let neoCode = neoNameClean.toLowerCase();

        // New string concatenated to the new li elements.
        neoLiElements += `<li class="text-sm md:text-base">${i + 1}: ${neoName} <a class="underline" href="https://eyes.nasa.gov/apps/asteroids/#/asteroids/${neoCode}" target="_blank">Live Location</a></li>`;
    }

    // Create the complete box of Neos under the picture box.
    const neoBox = $(`
        <div id="neoBox" class="flex flex-col items-center justify-between bg-black/50 backdrop-blur-md p-4 pt-8 md:p-8 md:pt-16 mx-3 max-w-4xl w-fit border border-t-0 border-gray-200 rounded-b-2xl mb-10">
            <h1 class="text-xl md:text-3xl font-bold font-brand text-gray-200 mb-4 md:mb-8 text-center">THE NEAR EARTH OBJECTS OF YOUR MEANINGFUL DAY</h1>
            <div id="neosDiv" class="h-40 overflow-auto m-0 font-body text-gray-200 bg-black/50 p-5 rounded-lg">
                <p class="text-sm md:text-base">That day, there were ${neoCount} objects found nearby! <br>
                Click on the links to see your nearby objects and their live locations across the solar system!</p>
                <br>
                <ul id="neosList">
                    ${neoLiElements}
                </ul>
            </div>
            <div class="flex justify-between mt-8">
                <button id="btnSave" class="btn bg-gray-200/30 hover:bg-slate-500/30 py-1 px-5 mx-5 text-lg md:text-xl font-brand font-black text-gray-200 rounded-lg">SAVE</button>
                <button id="btnClose" class="btn bg-gray-200/30 hover:bg-slate-500/30 py-1 px-5 mx-5 text-lg md:text-xl font-brand font-black text-gray-200 rounded-lg">CLOSE</button>
            </div>
        </div>`
    );

    // Appended to the box.
    $('#yourDayBox').append(neoBox);
    // Save message defined.
    const savedMsg = $('#saved');

    // Function to save the data after clicking the save button.
    const saveDate = (e) => {
        e.stopPropagation();

        savedMsg.addClass('opacity-100');
        const remSaveMsg = () => {
            savedMsg.addClass('trans-6s');
            savedMsg.removeClass('opacity-100');
        };
        // This line is to find if the date is already saved.
        let dateFinder = myDatesArray.find(element => element.d === inputDate);
        if (dateFinder === undefined) {
            // (d) for day, (p) for picture.
            myDatesArray.push( { d: inputDate, p: imgURL } );
            storeData();
            bookmarkZone.children().remove();
            // To update the carousel on the interface.
            renderCarousel();
        }
        // Save message disappears after a second.
        setTimeout(remSaveMsg, 1000);
        neoBox.off('click', '#btnSave', saveDate);
    };

    // Function to close everything after clicking the close button and returning to default view with the date picker.
    const closeBox = (e) => {
        e.stopPropagation();
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
    renderCarousel();
    // To update todays date every hour.
    setInterval(() => {
        todaysDate();
    }, 3600000);
});