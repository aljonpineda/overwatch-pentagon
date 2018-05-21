<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/css/style.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="/js/script.js"></script>
  <title>Overwatch Pentagon</title>
</head>

<body>
  <div class="header-container">
    <h1 id="title">Overwatch Pentagon</h1>
  </div>

  <div class="search-container">
    <p>
      Enter your username and battletag in the form [username]-[number].
    </p>

    <input type="text" name="username" value="[username]-[number]" id="u_input">
    <button id="submit_button">Submit</button>
  </div>

  <canvas id="canvas" width="200" height="200"></canvas>

  <div class="results-container">
  </div>

</body>
</html>
