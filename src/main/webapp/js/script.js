const supportHeroes = ["ana", "brigitte", "lucio", "mercy", "moira", "symmetra", "zenyatta"];
const offenseHeroes = ["doomfist", "genji", "mccree", "pharah", "reaper", "soldier76", "sombra", "tracer"];
const defenseHeroes = ["bastion", "hanzo", "junkrat", "mei", "torbjorn", "widowmaker"];
const tankHeroes = ["dva", "orisa", "reinhardt", "roadhog", "winston", "zarya"];

// For the pentagon
const versatilityDistance = 95;
const supportDistance = Math.sqrt((95 * 95) + (23.75 * 23.75));
const offenseDistance = Math.sqrt((71.25 * 71.25) + (95 * 95));
const defenseDistance = offenseDistance;
const tankDistance = supportDistance;

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

  $(".results-container").append("<h3>Quick Play</h3>");
  $(".results-container").append("<canvas id='canvasQuick' width='200' height='200'></canvas>");
  drawPentagon("canvasQuick", quickStats);

  $(".results-container").append("<ul id='quick'></ul>");
  $("#quick").append(`<li>Versatility: ${quickStats[0]}%</li>`);
  $("#quick").append(`<li>Support: ${quickStats[1]}%</li>`);
  $("#quick").append(`<li>Offense: ${quickStats[2]}%</li>`);
  $("#quick").append(`<li>Defense: ${quickStats[3]}%</li>`);
  $("#quick").append(`<li>Tank: ${quickStats[4]}%</li>`);

  $(".results-container").append("<h3>Competitive</h3>");
  $(".results-container").append("<canvas id='canvasComp' width='200' height='200'></canvas>");
  drawPentagon("canvasComp", compStats);

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

function drawPentagon(canvasID, stats) {
  var canvas = document.getElementById(canvasID);
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const points = [
    {x: 100, y: 0},
    {x: 200, y: 75},
    {x: 175, y: 200},
    {x: 25, y: 200},
    {x: 0, y: 75}
  ];

  var newVersatilityDistance = (stats[0] / 100) * versatilityDistance;

  var newSupportDistance = (stats[1] / 100) * supportDistance;
  var supportSolutions = solveQuadratic(17/16, (-1 * 223.125),
      (11714.0625 - Math.pow(newSupportDistance, 2))
  );

  var newOffenseDistance = (stats[2] / 100) * offenseDistance;
  var offenseSolutions = solveQuadratic(25/9, (-1 * 10375/18),
      (29900.17361 - Math.pow(newOffenseDistance, 2))
  );

  var newDefenseDistance = (stats[3] / 100) * defenseDistance;
  var defenseSolutions = solveQuadratic(25/9, (-1 * 9625/18),
      (25733.50694 - Math.pow(newDefenseDistance, 2))
  );

  var newTankDistance = (stats[4] / 100) * tankDistance;
  var tankSolutions = solveQuadratic(17/16, (-1 * 201.875),
      (9589.0625 - Math.pow(newTankDistance, 2))
  );

  var supportX = supportSolutions[0];
  var offenseX = offenseSolutions[0];
  var defenseX = defenseSolutions[1];
  var tankX = tankSolutions[1];

  var corners = [
    {x: 100, y: 95 - newVersatilityDistance},
    {x: supportX, y: 200 - solveSupportY(supportX)},
    {x: offenseX, y: 200 - solveOffenseY(offenseX)},
    {x: defenseX, y: 200 - solveDefenseY(defenseX)},
    {x: tankX, y: 200 - solveTankY(tankX)},
    {x: 100, y: 95 - newVersatilityDistance}
  ];

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";

  for (var i = 0; i < points.length; i++) {
    ctx.moveTo(100, 100);
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "white";

  ctx.moveTo(corners[0].x, corners[0].y);

  for (var i = 1; i < corners.length; i++) {
    ctx.lineTo(corners[i].x, corners[i].y);
  }

  ctx.stroke();
}

function solveQuadratic(a, b, c) {
  var x1 = ((-1 * b) + Math.sqrt((b * b) - (4 * a * c))) / (2 * a);
  var x2 = ((-1 * b) - Math.sqrt((b * b) - (4 * a * c))) / (2 * a);

  var solutions = [];
  solutions.push(x1);
  solutions.push(x2);
  return solutions;
}

function solveSupportY(x) {
  return (x / 4) + 75;
}

function solveOffenseY(x) {
  return (-1 * (4/3) * x) + (700/3);
}

function solveDefenseY(x) {
  return ((4/3) * x) - (100/3);
}

function solveTankY(x) {
  return (-1 * (x / 4)) + 125;
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
