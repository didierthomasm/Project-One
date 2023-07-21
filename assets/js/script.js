const carouselImages = [
  "image1.jpg",
  "image2.jpg",
  "image3.jpg",
  // Add more image filenames here...
];

function createCarousel() {
  const carouselDiv = document.querySelector(".carousel");

  carouselImages.forEach((image, index) => {
      const img = document.createElement("img");
      img.src = image;
      carouselDiv.appendChild(img);

      const button = document.createElement("button");
      button.innerText = "Show Image " + (index + 1);
      carouselDiv.appendChild(button);
  });

  const buttons = document.querySelectorAll(".carousel button");
  buttons.forEach((button, index) => {
      button.addEventListener("click", () => {
          showSlide(index);
      });
  });

  let slideIndex = 0;

  function showSlide(index) {
      const slides = document.querySelectorAll(".carousel img");
      const buttons = document.querySelectorAll(".carousel button");

      slides.forEach((slide) => (slide.style.display = "none"));
      buttons.forEach((button) => (button.style.display = "none"));

      slides[index].style.display = "block";
      buttons[index].style.display = "block";
  }

  setInterval(() => {
      slideIndex++;
      if (slideIndex >= carouselImages.length) {
          slideIndex = 0;
      }
      showSlide(slideIndex);
  }, 5000);
}

function initializeDatePicker() {
  const datepicker = document.getElementById("datepicker");
  datepicker.type = "date";
}

createCarousel();
initializeDatePicker();
