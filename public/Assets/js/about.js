/**
 * Preloader
 */
let preloader = document.querySelector("#preloader");
if (preloader) {
  window.onload = () => {
    preloader.remove();
    console.log("done.");
  };
}
