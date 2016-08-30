  (function() {
    while (Math.floor((Math.random() * 10) + 1) > 5) {
    var textElement = document.getElementById("content"),
      innerHTML = textElement.innerHTML,
      wordsArray = innerHTML.split(" "),
      words = wordsArray.length;
      var wordToHighlight = wordsArray[Math.floor((Math.random() * words) + 1)];
      document.getElementById("content").innerHTML = innerHTML.replace(wordToHighlight, '<span class="chosen">' + wordToHighlight + '</span>');
    }
  })();