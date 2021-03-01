window.onload = function() {
    const table = document.querySelector('table');
    const rows = document.querySelectorAll('tr');
    const rowsArray = Array.from(rows);
    const answer = ["1", "2", "3", "8", "", "4", "7", "6", "5"];
    // I did not want to use global variables, but things got weird.
    var isMovable = 0;
    var moveI = 0;
    var moveJ = 0;
    var history = [];

    table.addEventListener('click', (event) => {
      const rowIndex = rowsArray.findIndex(row => row.contains(event.target));
      const columns = Array.from(rowsArray[rowIndex].querySelectorAll('td'));
      const columnIndex = columns.findIndex(column => column == event.target);
      if (event.target.innerHTML != "") {
        switch_elems(rowIndex, columnIndex);
        checkSolved();
      }
    })

    function switch_elems(i, j) {
      const table = document.querySelector('table');
      const val1 = table.rows[i].cells[j].innerHTML;
      let k = j + 1;
      if (k > table.rows[i].cells.length - 1) {
          k = 0;
      }
      // Check if blank element is above
      if (i > 0) {
        if (table.rows[i - 1].cells[j].innerHTML == "") {
          table.rows[i].cells[j].innerHTML = "";
          table.rows[i - 1].cells[j].innerHTML = val1.toString();
          moveI = i - 1;
          moveJ = j;
          isMovable = 1;
        }
      }
      // Check if blank element is below
      if (i < 2) {
        if (table.rows[i + 1].cells[j].innerHTML == "") {
          table.rows[i].cells[j].innerHTML = "";
          table.rows[i + 1].cells[j].innerHTML = val1.toString();
          moveI = i + 1;
          moveJ = j;
          isMovable = 1;
        }
      }
      // Check if blank element is to the right
      if (j < 2) {
        if (table.rows[i].cells[j + 1].innerHTML == "") {
          table.rows[i].cells[j].innerHTML = "";
          table.rows[i].cells[j + 1].innerHTML = val1.toString();
          moveI = i;
          moveJ = j + 1;
          isMovable = 1;
        }
      }
      // Check if blank element is to the left
      if (j > 0) {
        if (table.rows[i].cells[j - 1].innerHTML == "") {
          table.rows[i].cells[j].innerHTML = "";
          table.rows[i].cells[j - 1].innerHTML = val1.toString();
          moveI = i;
          moveJ = j - 1;
          isMovable = 1;
        }
      }
    }
    function checkSolved() {
      // Check if function is solved
      // Select all TD elements
      var cols = document.querySelectorAll('td');
      var finArray = Array.from(cols);

      // Set what the correct array looks like

      // Get there inner HTML for a more readable format
      for (var i = 0; i < finArray.length; ++i) {
        finArray[i] = finArray[i].innerHTML;
      }

      // Set solved by default, then check if each element of the array matches
      var solved = 1;
      for (var i = 0; i < finArray.length; ++i) {
        if (finArray[i] !== answer[i]) {
          solved = 0; // Set solved to 0 if array does not match
        }
      }
      if (solved == 1) {
        document.getElementById("condition").style.display = "block";
      } else {
        document.getElementById("condition").style.display = "none";
      }
    }
    // Shuffle the puzzle
    document.getElementById("shuffle").addEventListener("click", shufflePuzzle);
    function shufflePuzzle() {
      history = [];
      var iterations = 30;
      // Reset the puzzle to its answer state...weirdly.
      for (var i = 0; i < answer.length; i++) {
        k = i + 1;
        if (i < 3) {
          document.querySelector("tr:nth-child(1) td:nth-child(" + k + ")").innerHTML = answer[i];
        } else if  (i < 6) {
           k = k - 3;
          document.querySelector("tr:nth-child(2) td:nth-child(" + k + ")").innerHTML = answer[i];
        } else if (i < 9) {
           k = k - 6;
          document.querySelector("tr:nth-child(3) td:nth-child(" + k + ")").innerHTML = answer[i];
        }
      }
      // Technically random selection -- but the switch_elems function will not allow for invalid movements.
      for(var i = 0; i < iterations; i++) {
        isMovable = 0;
        let rand1 = Math.floor(Math.random() * 3);
        let rand2 = Math.floor(Math.random() * 3);
        switch_elems(rand1, rand2);
        if (history.length >= 1) {
           var rowPrev = parseInt(history[i - 1].charAt(0));
           var colPrev = parseInt(history[i - 1].charAt(1));
        }
        if (isMovable == 0) {
          i--;
        } else {
            history[i] = moveI.toString() + moveJ.toString();
        }
      }
      document.getElementById("condition").style.display = "none";
    }

    // Solve the Puzzle
    document.getElementById("solve").addEventListener("click", solvePuzzle);
    function solvePuzzle() {
      for (var i = history.length; 0 < i; i--) {
        var counter = history.length - i;
        var rowi = parseInt(history[i - 1].charAt(0));
        var colj = parseInt(history[i - 1].charAt(1));
        (function(counter, row, col) {
          setTimeout(function(){
            switch_elems(row, col);
          },500*counter);
        })(counter, rowi, colj);
      }
      setTimeout(function(){ alert("Puzzle has been solved!"); }, 15000);
      document.getElementById("condition").style.display = "none";
    }
}
