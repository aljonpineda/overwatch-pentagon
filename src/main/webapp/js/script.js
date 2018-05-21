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

  var playtimeQuick = response.us.heroes.playtime.quickplay;
  var playtimeComp = response.us.heroes.playtime.competitive;

  var totalTimeQuick = totalTime(playtimeQuick);
  var totalTimeComp = totalTime(playtimeComp);

  var quickStats = [
    calculateVersatility(totalTimeQuick, playtimeQuick),
    calculateSupport(totalTimeQuick, playtimeQuick),
    calculateOffense(totalTimeQuick, playtimeQuick),
    calculateDefense(totalTimeQuick, playtimeQuick),
    calculateTank(totalTimeQuick, playtimeQuick)
  ];

  var compStats = [
    calculateVersatility(totalTimeComp, playtimeComp),
    calculateSupport(totalTimeComp, playtimeComp),
    calculateOffense(totalTimeComp, playtimeComp),
    calculateDefense(totalTimeComp, playtimeComp),
    calculateTank(totalTimeComp, playtimeComp)
  ];

  drawPentagon(quickStats);

  $(".results-container").append("<h3>Quick Play</h3>");
  $(".results-container").append("<ul id='quick'></ul>");
  $("#quick").append(`<li>Versatility: ${quickStats[0]}%</li>`);
  $("#quick").append(`<li>Support: ${quickStats[1]}%</li>`);
  $("#quick").append(`<li>Offense: ${quickStats[2]}%</li>`);
  $("#quick").append(`<li>Defense: ${quickStats[3]}%</li>`);
  $("#quick").append(`<li>Tank: ${quickStats[4]}%</li>`);

  $(".results-container").append("<h3>Competitive</h3>");
  $(".results-container").append("<ul id='comp'></ul>");
  $("#comp").append(`<li>Versatility: ${compStats[0]}%</li>`);
  $("#comp").append(`<li>Support: ${compStats[1]}%</li>`);
  $("#comp").append(`<li>Offense: ${compStats[2]}%</li>`);
  $("#comp").append(`<li>Defense: ${compStats[3]}%</li>`);
  $("#comp").append(`<li>Tank: ${compStats[4]}%</li>`);
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

/* The rest of the functions are calculated based on the percentage of total
playtime spent on a particular category of heroes.*/
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

function drawPentagon(stats) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var points = [
    {x: 100, y: 0},
    {x: 200, y: 75},
    {x: 175, y: 200},
    {x: 25, y: 200},
    {x: 0, y: 75}
  ];

  var supportDistance = Math.sqrt((100 * 100) + (25 * 25));
  var offenseDistance = 125;

  var corners = [
    {x: 100, y: (100 - stats[0])},
    {x: 200, y: 75},
    {x: 175, y: 200},
    {x: 25, y: 200},
    {x: 0, y: 75}
  ];

  ctx.beginPath();

  for (var i = 0; i < points.length; i++) {
    ctx.moveTo(100, 100);
    ctx.lineTo(points[i].x, points[i].y);
  }

  for (var i = 0; i < corners.length; i++) {
    ctx.lineTo(corners[i].x, corners[i].y);
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = "white";
  ctx.stroke();
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
