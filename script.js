const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

let isInitialLoad = true;

// ==> UNSPLASH API <==
const count = 30;
const apiKey = "AzUg3H_TaRCEoEFia2iFX8dNGE0W8XlnNcoojCehX3g";
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

// ==> SET FINAL COUNT NUMBER FOR ALL PICS <==
function updateAPIURLWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
}

// ==> CHECK IF ALL IMAGES WERE LOADED <==
function imageLoaded() {
  console.log("loaded");
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// ==> HELPER FUNCTION TO SET ATTRIBUTES ON DOM ELEMENTS <==
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// ==> CREATE ELEMENTS FOR LINKS & PHOTOS, ADD TO DOM <==
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // ==> Run function for each object in photosArray <==
  photosArray.forEach(photo => {
    // ==> Create <a> to link to unsplash <==
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });
    // ==> Create <img> for photo <==
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    // ==> Event Listener, check when each is finished loading <==
    img.addEventListener("load", imageLoaded);
    // ==> Put <img> inside <a>, then put both inside imageContainer element <==
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// ==> GET PHOTOS FROM UNSPLASH API <==
async function getPhotosFromUnsplash() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    if (isInitialLoad) {
      updateAPIURLWithNewCount(30);
      isInitialLoad = false;
    }
  } catch (error) {
    console.log(error);
  }
}

// ==> CHECK TO SEE IF SCROLLING NEAR BOTTOM OF PAGE, LOAD MORE PHOTOS <==
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotosFromUnsplash();
  }
});

// ==> ON LOAD <==
getPhotosFromUnsplash();
