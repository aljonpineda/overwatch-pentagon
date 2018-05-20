function doGet() {
  // Clears the results container
  $(".results-container").empty();

  let usernameValue = $("#u_input").val();

  // Clears the text input
  $("#u_input").val("");

  // Makes a GET request to the OWAPI
  $.ajax({
    url: `https://owapi.net/api/v3/u/${usernameValue}/heroes`,
    type: "GET",
    data: {
      format: "json"
    },
    success: [setPlayer(usernameValue), getSuccess],
    error: getError
  });
}

function getError() {
  $(".results-container p").remove();
  $(".results-container").append("<p>User not found. Please try again.</p>");
}

function setPlayer(usernameValue) {
  $(".results-container").append(`<h2>Results for ${usernameValue}</h2>`);
  $(".results-container").append("<p>Working...</p>");
}

function getSuccess(response) {
  // Removes "Working..."
  $(".results-container p").remove();

  let playtimeQuick = response.us.heroes.playtime.quickplay;
  let playtimeComp = response.us.heroes.playtime.competitive;

  $(".results-container").append("<h3>Quick Play</h3>");
  $(".results-container").append(`<p>Versatility: ${calculateVersatility(playtimeQuick)}%</p>`);

  $(".results-container").append("<h3>Competitive</h3>");
  $(".results-container").append(`<p>Versatility: ${calculateVersatility(playtimeComp)}%</p>`);
}

function calculateVersatility(playtime) {
  var total = 0;
  for (hero in playtime) {
    total += playtime[hero];
  }

  var ratios = [];
  for (hero in playtime) {
    ratios.push(playtime[hero] / total);
  }
  ratios.sort(function(a, b) {return b - a});

  var versatility = (1 - ratios[0]).toFixed(2) * 100;
  return versatility;
}

function setup() {
  // Calls the doGet function when Submit is clicked
  $("#submit_button").click(doGet);

  // Calls the same doGet function if the user presses Enter
  $("#u_input").keypress(function(event) {
    // 13 is the key for Enter
    if (event.which == 13) {
      doGet();
    }
  });
}

$(document).ready(setup);
