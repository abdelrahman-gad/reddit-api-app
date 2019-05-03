import reddit from "./redditapi";

/**
 * @description catching the html element form#search-form  and asssigning it to a DOM object
 * @const
 * @name searchForm
 * @type {Object} DOM object
 */
const searchForm = document.getElementById("search-form");

/**
 * @description catching the html element button#search-btn  and asssigning it to a DOM object
 * @const
 * @name searchBtn
 * @type {Object} DOM object
 */
const searchBtn = document.getElementById("search-btn");

/**
 * @description catching the html element form#search-input  and asssigning it to a DOM object
 * @const
 * @name searchInput
 * @type {Object} DOM object
 */
const searchInput = document.getElementById("search-input");

/**
 * @description thei most important functio it takes the inputs parameters from the {@link searchform}
 * then passing the via the url from the method {@link search} then getting the respnse then populate the DOM
 * @summary make response/get response /populate the DOM
 * @param {Object} event object
 * @name handleSubmit
 * @function
 */
function handleSubmit(e) {
  // Get sort
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  // Get limit
  const searchLimit = document.getElementById("limit").value;
  // Get search
  const searchTerm = searchInput.value;
  // Check for input
  if (searchTerm == "") {
    // Show message
    showMessage("Please add a search term", "alert-danger");
  }
  // Clear field
  searchInput.value = "";

  // Search Reddit
  reddit.search(searchTerm, searchLimit, sortBy).then(results => {
    let output = '<div class="card-columns">';
    console.log(results);
    results.forEach(post => {
      // Check for image
      let image = post.preview
        ? post.preview.images[0].source.url
        : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";
      output += `
            <div class="card mb-2">
            <img class="card-img-top" src="${image}" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">${truncateString(post.selftext, 100)}</p>
              <a href="${post.url}" target="_blank
              " class="btn btn-primary">Read More</a>
              <hr>
              <span class="badge badge-secondary">Subreddit: ${
                post.subreddit
              }</span> 
              <span class="badge badge-dark">Score: ${post.score}</span>
            </div>
          </div>
            `;
    });
    output += "</div>";
    document.getElementById("results").innerHTML = output;
  });
}

/**
 * @description submit event requesting the url and getting back the response viia the {@link handleSubmit}
 * @name submit
 * @event
 * @param {String} submit the name of event to be
 * @param {function} callback callback function takes event object an aparameter
 *
 */

searchForm.addEventListener("submit", e => {
  e.preventDefault();
  handleSubmit(e);
});

/**
 * @description  if the user doesn't enter proper inputs this message gonnea alert reminding him to do
 * it also gonna fade seconds after
 * @function
 * @name showMessage
 * @param {String} message text to be shown to the user
 * @param {String}  className warning effect is aded to the text
 */
function showMessage(message, className) {
  // Create div
  const div = document.createElement("div");
  // Add classes
  div.className = `alert ${className}`;
  // Add text
  div.appendChild(document.createTextNode(message));
  // Get parent
  const searchContainer = document.getElementById("search-container");
  // Get form
  const search = document.getElementById("search");

  // Insert alert
  searchContainer.insertBefore(div, search);

  // Timeout after 3 sec
  setTimeout(function() {
    document.querySelector(".alert").remove();
  }, 3000);
}

/**
 * @description truncating the too long texts
 * @name truncateString
 * @function
 * @param {String} myString  text to be truncated  in case it is too long to show
 * @param {Number} limit     the maximum letters length to be truncated (index to truncate from)
 * @returns {String}   trancated string fitting to be shown
 */
function truncateString(myString, limit) {
  const shortened = myString.indexOf(" ", limit);
  if (shortened == -1) return myString;
  return myString.substring(0, shortened);
}
