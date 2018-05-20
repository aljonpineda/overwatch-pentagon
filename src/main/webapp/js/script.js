const supportHeroes = ["ana", "brigitte", "lucio", "mercy", "moira", "symmetra", "zenyatta"];
const offenseHeroes = ["doomfist", "genji", "mccree", "pharah", "reaper", "soldier76", "sombra", "tracer"];
const defenseHeroes = ["bastion", "hanzo", "junkrat", "mei", "torbjorn", "widowmaker"];
const tankHeroes = ["dva", "orisa", "reinhardt", "roadhog", "winston", "zarya"];

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

  let totalTimeQuick = totalTime(playtimeQuick);
  let totalTimeComp = totalTime(playtimeComp);

  $(".results-container").append("<h3>Quick Play</h3>");
  $(".results-container").append("<ul id='quick'></ul>");
  $("#quick").append(`<li>Versatility: ${calculateVersatility(totalTimeQuick, playtimeQuick)}%</li>`);
  $("#quick").append(`<li>Support: ${calculateSupport(totalTimeQuick, playtimeQuick)}%</li>`);
  $("#quick").append(`<li>Offense: ${calculateOffense(totalTimeQuick, playtimeQuick)}%</li>`);
  $("#quick").append(`<li>Defense: ${calculateDefense(totalTimeQuick, playtimeQuick)}%</li>`);
  $("#quick").append(`<li>Tank: ${calculateTank(totalTimeQuick, playtimeQuick)}%</li>`);

  $(".results-container").append("<h3>Competitive</h3>");
  $(".results-container").append("<ul id='comp'></ul>");
  $("#comp").append(`<li>Versatility: ${calculateVersatility(totalTimeComp, playtimeComp)}%</li>`);
  $("#comp").append(`<li>Support: ${calculateSupport(totalTimeComp, playtimeComp)}%</li>`);
  $("#comp").append(`<li>Offense: ${calculateOffense(totalTimeComp, playtimeComp)}%</li>`);
  $("#comp").append(`<li>Defense: ${calculateDefense(totalTimeComp, playtimeComp)}%</li>`);
  $("#comp").append(`<li>Tank: ${calculateTank(totalTimeComp, playtimeComp)}%</li>`);
}

function totalTime(playtime) {
  var total = 0;
  for (hero in playtime) {
    total += playtime[hero];
  }

  return total;
}

function calculateVersatility(total, playtime) {
  var ratios = [];
  for (hero in playtime) {
    ratios.push(playtime[hero] / total);
  }

  // Sorts descending
  ratios.sort(function(a, b) {return b - a});

  /* ratios[0] corresponds to the hero with the most playtime. Versatility is
  calculated by subtracting the largest ratio from 1, then finding the ratio of
  this new value to the value (1 - 1/27) which corresponds to having 100%
  versatility.*/
  var versatility = Math.round(((1 - ratios[0]) / (1 - 1 / 27)) * 100);
  return versatility;
}

function calculateSupport(total, playtime) {
  var suppTotal = 0;
  for (hero in playtime) {
    if (supportHeroes.indexOf(hero) >= 0) {
      suppTotal += playtime[hero];
    }
  }

  var support = Math.round((suppTotal / total) * 100);
  return support;
}

function calculateOffense(total, playtime) {
  var offTotal = 0;
  for (hero in playtime) {
    if (offenseHeroes.indexOf(hero) >= 0) {
      offTotal += playtime[hero];
    }
  }

  var offense = Math.round((offTotal / total) * 100);
  return offense;
}

function calculateDefense(total, playtime) {
  var defTotal = 0;
  for (hero in playtime) {
    if (defenseHeroes.indexOf(hero) >= 0) {
      defTotal += playtime[hero];
    }
  }

  var defense = Math.round((defTotal / total) * 100);
  return defense;
}

function calculateTank(total, playtime) {
  var tankTotal = 0;
  for (hero in playtime) {
    if (tankHeroes.indexOf(hero) >= 0) {
      tankTotal += playtime[hero];
    }
  }

  var tank = Math.round((tankTotal / total) * 100);
  return tank;
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
