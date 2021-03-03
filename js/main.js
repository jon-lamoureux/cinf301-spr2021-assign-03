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
    var result;

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
          result = "up";
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
          result = "down";
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
          result = "right";
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
          result = "left";
        }
      }
      return result;
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
        document.getElementById("condition-2").style.display = "none";
      } else {
        document.getElementById("condition").style.display = "none";
        document.getElementById("condition-2").style.display = "none";
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
        var result = switch_elems(rand1, rand2);
        if (isMovable == 0) {
          i--;
        } else {
          history[i] = moveI.toString() + moveJ.toString();
        }
      }
      document.getElementById("condition").style.display = "none";
      document.getElementById("condition-2").style.display = "none";
    }

    // Solve the Puzzle
    document.getElementById("solve").addEventListener("click", solvePuzzle);
    function solvePuzzle() {
      document.getElementById("solution").innerHTML = "";
      var x = history.length;
      var timedSolve = setInterval(function(){
          document.getElementById("solve").disabled = true;
          document.getElementById("shuffle").disabled = true;
          let rowi = parseInt(history[x - 1].charAt(0));
          let colj = parseInt(history[x - 1].charAt(1));
          let indexRow = rowi + 1;
          let indexCol = colj + 1;
          var currStep = document.querySelector("tr:nth-child(" + indexRow +") td:nth-child(" + indexCol + ")").innerHTML;
          switch_elems(rowi, colj);
          let div = document.createElement('div');
          div.id = result;
          div.innerHTML = currStep;
          document.getElementById("solution").appendChild(div);
          x--;
          if (x == 0) {
            document.getElementById("condition-2").style.display = "block";
            clearInterval(timedSolve);
            document.getElementById("solve").disabled = false;
            document.getElementById("shuffle").disabled = false;
          }
        },500);
      document.getElementById("condition").style.display = "none";
    }
}
