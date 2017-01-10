//creates player's fleet map
var myTable = new Array(10);
for (i = 0; i < 10; i++)
  myTable[i] = new Array(10);

//creates computer's fleet map
var enemyTable = new Array(10);
for (i = 0; i < 10; i++)
  enemyTable[i] = new Array(10);

//values' table that is used for AI processing
var valTable = new Array(10);
for (i = 0; i < 10; i++)
  valTable[i] = new Array(10);

var bestCol, bestRow;// position for computer's choice

//initialization of tables
for (i = 0; i < 10; i++)
  for (j = 0; j < 10; j++) {
    myTable[i][j] = 0;
    enemyTable[i][j] = 0;
  }
  //modes
var allocationMode = false;
var playingMode = false;
var rotation = true; // true -horizontal, false -vertical
var playerTry = true;
var intervalIndex; 

//fills given table with 0s
function fillTable(table) //fill zeros
{
  for (i = 0; i < 10; i++)
    for (j = 0; j < 10; j++) {
      table[i][j] = 0;
    }
}
//initialize ValTable(values' table)
function initValtable() {
  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      valTable[i][j] = 9 - (Math.abs(4 - i) + Math.abs(4 - j));
    }
  }
  for (i = 5; i < 10; i++) {
    for (j = 5; j < 10; j++) {
      valTable[i][j] = 9 - (Math.abs(5 - i) + Math.abs(5 - j));
    }
  }
  for (i = 0; i < 5; i++) {
    for (j = 5; j < 10; j++) {
      valTable[i][j] = 9 - (Math.abs(4 - i) + Math.abs(5 - j));
    }
  }
  for (i = 5; i < 10; i++) {
    for (j = 0; j < 5; j++) {
      valTable[i][j] = 9 - (Math.abs(5 - i) + Math.abs(4 - j));
    }
  }
}
//checks if  there is shot at the given point on values' table
function isShotValTable(col, row) {
  if (valTable[col - 1][row - 1] == -1)
    return true;
  return false;
}
//updates values' table
function updateValTable(col, row, isShot) {
  valTable[col - 1][row - 1] = -1;
  if (isShot != true) {
    for (i = 1; i < 4; i++) {
      if (isValidCell(col + i, row) && !isShotValTable(col + i, row) && valTable[col + i - 1][row - 1] >= (4 - i)) {
        valTable[col + i - 1][row - 1] -= (4 - i);
      }
      if (isValidCell(col - i, row) && !isShotValTable(col - i, row) && valTable[col - i - 1][row - 1] >= (4 - i)) {
        valTable[col - i - 1][row - 1] -= (4 - i);
      }
      if (isValidCell(col, row + i) && !isShotValTable(col, row + i) && valTable[col - 1][row + i - 1] >= (4 - i)) {
        valTable[col - 1][row + i - 1] -= (4 - i);
      }
      if (isValidCell(col, row - i) && !isShotValTable(col, row - i) && valTable[col - 1][row - i - 1] >= (4 - i)) {
        valTable[col - 1][row - i - 1] -= (4 - i);
      }
    }
  } else {
    //decreasing values at the whole table
    for (i = 1; i < 9; i++) {
      for (j = 1; j < 9; j++) {
        if (!isShotValTable(i + 1, j + 1))
          if (valTable[i][j] >= 1)
            valTable[i][j]--;
      }
    }
    //incresing around shotting point
    for (i = 1; i < 4; i++) {
      if (isValidCell(col + i, row) && !isShotValTable(col + i, row)) {
        valTable[col + i - 1][row - 1] += (4 - i);
      }
      if (isValidCell(col - i, row) && !isShotValTable(col - i, row)) {
        valTable[col - i - 1][row - 1] += (4 - i);
      }
      if (isValidCell(col, row + i) && !isShotValTable(col, row + i)) {
        valTable[col - 1][row + i - 1] += (4 - i);
      }
      if (isValidCell(col, row - i) && !isShotValTable(col, row - i)) {
        valTable[col - 1][row - i - 1] += (4 - i);
      }
    }
  }
}
//best point coords will be written on global variables - bestRow,bestCol
function generateBestpoint() {
  bestRow = 1;
  bestCol = 1;
  for (i = 0; i < 10; i++) {
    for (j = 0; j < 10; j++) {
      if (valTable[bestCol - 1][bestRow - 1] < valTable[i][j]) {
        bestCol = i + 1;
        bestRow = j + 1;
      }
    }
  }
}
//geneate index of position 1-10
function generateNum() {
  var r = Math.random();
  if (r < 0.1)
    return 1;
  if (r < 0.2)
    return 2;
  if (r < 0.3)
    return 3;
  if (r < 0.4)
    return 4;
  if (r < 0.5)
    return 5;
  if (r < 0.6)
    return 6;
  if (r < 0.7)
    return 7;
  if (r < 0.8)
    return 8;
  if (r < 0.9)
    return 9;
  return 10;
};
//validate indexes column and rows for table presented as  an array of arrays
function isValidCell2(col, row) {
  return (col >= 0 && col <= 9) && (row >= 0 && row <= 9);
};
//validate indexes column and rows for the visual table
function isValidCell(col, row) {
  return (col >= 1 && col <= 10) && (row >= 1 && row <= 10);
};
//run from a cell to specified direction on a given table and write values on them.
function runOnCellsForValue(col, row, isHoriz, val, length, table) // start point(col,row) ,is Horiz-direction, val -value, run's length
{
  if (isHoriz == true) {
    for (i = 0; i < length; i++)
      if (isValidCell(col + i, row))
        table[col + i - 1][row - 1] = val;
  } else {
    for (i = 0; i < length; i++)
      if (isValidCell(col, row + i))
        table[col - 1][row + i - 1] = val;
  }
};
//marks neighboring cells for given ship(that is presented headcell - col, row, isHoriz true or false and size)
//with wanted value
function markNeighborCells(col, row, isHoriz, size, table, val) {
  if (isHoriz == true) {
    if (isValidCell(col - 1, row)) //left to headCell
      table[col - 2][row - 1] = val;
    runOnCellsForValue(col - 1, row - 1, true, val, size + 2, table);
    runOnCellsForValue(col - 1, row + 1, true, val, size + 2, table);
    if (isValidCell(col + size, row)) //right to last cell of ship
      table[col + size - 1][row - 1] = val;
  } else {
    if (isValidCell(col, row - 1)) //top to headCell
      table[col - 1][row - 2] = val;
    runOnCellsForValue(col - 1, row - 1, false, val, size + 2, table);
    runOnCellsForValue(col + 1, row - 1, false, val, size + 2, table);
    if (isValidCell(col, row + size)) //bottom to last cell of ship
      table[col - 1][row + size - 1] = val;
  }
};
// checks if there is place for ship. it takes ship's head cell, size, rotation as arguments
function isFree(col, row, rot, shipSize, table) {
  if (rot == true) {
    for (i = 0; i < shipSize; i++) {
      if (table[col + i - 1][row - 1] != 0)
        return false;
    }
  } else {
    for (i = 0; i < shipSize; i++) {
      if (table[col - 1][row + i - 1] != 0)
        return false;
    }
  }
  return true;
};
//automatical allocation of fleet by random
function autoAllocation(table) {
  var size1 = 1;
  //computer allocates ships
  for (k = 1; k <= 10; k++) {
    //determines what kind ship computer allocates for at the moment
    if (k <= 4)
      size1 = 1;
    else
    if (k <= 7)
      size1 = 2;
    else
    if (k <= 9)
      size1 = 3;
    else
      size1 = 4;
    var stop = false
    while (stop == false) {
      var col1 = generateNum();
      var row1 = generateNum();
      var rotation = (Math.random() * 10 >= 5) ? true : false;
      if (rotation == true) {
        if (col1 <= (11 - size1)) {
          if (isFree(col1, row1, true, size1, table)) {
            for (j = 0; j < size1; j++) {
              table[col1 + j - 1][row1 - 1] = 1;
            }
            markNeighborCells(col1, row1, true, size1, table, 2);
            stop = true;
          }
        }
      } else {
        if (row1 <= (11 - size1)) {
          if (isFree(col1, row1, false, size1, table)) {
            for (j = 0; j < size1; j++) {
              table[col1 - 1][row1 + j - 1] = 1;
            }
            markNeighborCells(col1, row1, false, size1, table, 2);
            stop = true;
          }

        }
      }

    }

  }
};

//Functions implemented using JQuery
$(document).ready(function() {
  //initialize datas for table cells
  $("table td").data("ishover", true); //ishover is enabled for all the cells
  $('table td').data("isclick", true); //isclick is enabled for all the cells
//prepares starting games after allocation of ships
  function prepareGame() {
    $("#myTable td").data('isclick', false);
    $("#myTable td").data('ishover', false);
    $("#rotate").attr("disabled", true);
    $("#auto").attr("disabled", true);
    var list = document.getElementsByClassName("list")[0];
    list.parentNode.removeChild(list);
    allocationMode = false;
    playingMode = true;
    $("#textDiv").html("<span>Computer allocates its fleet.<br>Please, wait.</span>");
    autoAllocation(enemyTable);
    $("#textDiv").html("<span>Computer finished allocation of its fleet<br> Now you can attack!</span>");
    $("#Ctablediv").css("box-shadow"," 0px 0px 10px 5px yellow");
  }
 
  function getCol(td) {

    var column_num = parseInt($(td).index());
    return column_num;

  };

  function getRow(td) {

    var row_num = parseInt($(td).parent().index());
    return row_num;
  };

  function blackFullShip(headCol, headRow, rot, size, isPlayerTable) {
    var table;
    if (isPlayerTable) //so it is attack of computer
    {
      table = "#myTable";
    } else //attack of human player
    {
      table = "#enemyTable";
    }
    if (rot == true) {
      for (i = 0; i < size; i++) {
        $(table).children().eq(0).children().eq(headRow).children().eq(headCol + i).css("background-color", "black");
      }
    } else {
      for (i = 0; i < size; i++) {
        $(table).children().eq(0).children().eq(headRow + i).children().eq(headCol).css("background-color", "black");
      }
    }
  }

  function getShipSize(shipName) {

    if (shipName.indexOf("Small") != -1)
      return 1;
    if (shipName.indexOf("Average") != -1)
      return 2;
    if (shipName.indexOf("Big") != -1)
      return 3;
    return 4;
  };

  function visualiseTable(isPlayer) {
    if (isPlayer == true) //human player
    {
      for (v = 0; v < 10; v++)
        for (s = 0; s < 10; s++) {
          if (myTable[v][s] == 1) {
            $("#myTable").children().eq(0).children().eq(s + 1).children().eq(v + 1).css("background-color", "gray");
          }
        }
    } else //computer
    {
      for (i = 0; i < 10; i++)
        for (j = 0; j < 10; j++) {
          if (enemyTable[i][j] == 1) {
            $("#enemyTable").children().eq(0).children().eq(j + 1).children().eq(i + 1).css("background-color", "gray");
          }
        }
    }
  };
  //checks if ship is destroyed full of the given point, then marked arouund cells also destroyed
  function ifShipDestroyed(col, row, table) {
    var counter = 0; ///counts survived parts of ships
    var size = 1; // to count size of the ship
    var i = 1; //usual counter for whiles
    //ship's head cell's coords
    var headCol = col;
    var headRow = row;

    //horizontally checking for ships parts
    while (isValidCell(col + i, row)) {
      if (table[col + i - 1][row - 1] == 2 || table[col + i - 1][row - 1] == 4)
        break;
      if (table[col + i - 1][row - 1] != 3) {
        counter++;
      }
      size++;
      i++;
    }
    i = 1;
    while (isValidCell(col - i, row)) {
      if (table[col - i - 1][row - 1] == 2 || table[col - i - 1][row - 1] == 4)
        break;
      if (table[col - i - 1][row - 1] != 3) {
        counter++;
      }
      headCol--;
      size++;
      i++;
    }
    //vertically
    i = 1;
    while (isValidCell(col, row + i))

    {
      if (table[col - 1][row + i - 1] == 2 || table[col - 1][row + i - 1] == 4)
        break;
      if (table[col - 1][row + i - 1] != 3) {
        counter++;
      }
      size++;
      i++;
    }
    i = 1;
    while (isValidCell(col, row - i)) {
      if (table[col - 1][row - i - 1] == 2 || table[col - 1][row - i - 1] == 4)
        break;
      if (table[col - 1][row - i - 1] != 3) {
        counter++;
      }
      headRow--;
      size++;
      i++;
    }

    if (counter > 0) // so ship is alives still then we return false
    {
      return false;
    } else // ship is destroyed
    {
      //find out whether ship is horizontally alocated or vertically
      var rot = true;
      if (isValidCell(headCol + 1, headRow)) {
        if (table[headCol][headRow - 1] == 3)
          rot = true; // horiz
        else
          rot = false; //ver
      } else {
        if (isValidCell(headCol, headRow + 1)) {
          if (table[headCol - 1][headRow] == 3)
            rot = false; //ver
          else
            rot = true; //hor
        }
      }
      //mark around cells as destroyed( because of big boom of the ship :) )
      markNeighborCells(headCol, headRow, rot, size, table, 4);
      blackFullShip(headCol, headRow, rot, size, table == myTable);
      //return value of the function indicating full sank
      return true;
    }
  }
  var colors = new Array(5); // to save colors for hover
  $("#myTable td").hover(function() {
      if ($(this).data("ishover") == true) {
        if (allocationMode == true) //player allocates freelt
        {
          var opt = $(".list").val();
          var size = getShipSize(String(opt)); //find out size of ship

          if (rotation == true) //horizontally allocated
          {
            if (getCol(this) <= (11 - size)) //check if there is enough place to allocate ship
            {
              if (isFree(getCol(this), getRow(this), true, size, myTable)) {
                $(this).css("background-color", "#25ABC4"); //changes pointing cell's color
                //changes remainimg parts for ship
                for (i = 1; i < size; i++)
                  $(this).parent().children().eq(getCol(this) + i).css("background-color", "#25ABC4");

              } else {
                colors[0] = $(this).css("background-color"); //saves colro for mouseleave
                $(this).css("background-color", "#FF3E34"); //changes pointing cell's color
                //changes remainimg parts for ship
                for (i = 1; i < size; i++) {
                  colors[i] = $(this).parent().children().eq(getCol(this) + i).css("background-color");

                  $(this).parent().children().eq(getCol(this) + i).css("background-color", "#FF3E34");
                }

              }

            }
          } else {
            if (getRow(this) <= (11 - size)) {
              if (isFree(getCol(this), getRow(this), false, size, myTable)) {
                $(this).css("background-color", "#25ABC4");
                for (i = 1; i < size; i++)
                  $(this).parent().parent().children().eq(getRow(this) + i).children().eq(getCol(this)).css("background-color", "#25ABC4");
              } else {
                colors[0] = $(this).css("background-color");
                $(this).css("background-color", "#FF3E34");
                for (i = 1; i < size; i++) {
                  colors[i] = $(this).parent().parent().children().eq(getRow(this) + i).children().eq(getCol(this)).css("background-color");
                  $(this).parent().parent().children().eq(getRow(this) + i).children().eq(getCol(this)).css("background-color", "#FF3E34");
                }
              }
            }
          }
        } else
          $(this).css("background-color", "#25ABC4");
      }

    },
    function() {
      if ($(this).data("ishover") == true) {
        if (allocationMode == true) //player allocates freelt
        {
          var opt = $(".list").val();
          var size = getShipSize(String(opt));

          if (rotation == true) //horizontally allocated
          {
            if (getCol(this) <= (11 - size)) {
              if (isFree(getCol(this), getRow(this), true, size, myTable)) {
                $(this).css("background-color", "#73CEDF");
                for (i = 1; i < size; i++)
                  $(this).parent().children().eq(getCol(this) + i).css("background-color", "#73CEDF");
              } else {
                $(this).css("background-color", colors[0]);
                for (i = 1; i < size; i++)
                  $(this).parent().children().eq(getCol(this) + i).css("background-color", colors[i]);
              }

            }
          } else {
            if (getRow(this) <= (11 - size)) {
              if (isFree(getCol(this), getRow(this), false, size, myTable)) {
                $(this).css("background-color", "#73CEDF");
                for (i = 1; i < size; i++)
                  $(this).parent().parent().children().eq(getRow(this) + i).children().eq(getCol(this)).css("background-color", "#73CEDF");
              } else {
                $(this).css("background-color", colors[0]);
                for (i = 1; i < size; i++)
                  $(this).parent().parent().children().eq(getRow(this) + i).children().eq(getCol(this)).css("background-color", colors[i]);
              }
            }
          }
        } else
          $(this).css("background-color", "#73CEDF");
      }


    })

  function markDestroyedShipSides(isPlayer) {
    if (isPlayer) //who is attacker
    {
      for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
          if (enemyTable[i][j] == 4) {
            $("#enemyTable").children().eq(0).children().eq(j + 1).children().eq(i + 1).css("background-color", "red");
            $("#enemyTable").children().eq(0).children().eq(j + 1).children().eq(i + 1).data("ishover", false);
            $("#enemyTable").children().eq(0).children().eq(j + 1).children().eq(i + 1).data("isclick", false);
          }
        }
      }
    } else {
      for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
          if (myTable[i][j] == 4) {
            $("#myTable").children().eq(0).children().eq(j + 1).children().eq(i + 1).css("background-color", "red");

          }
        }
      }
    }
  }
  //click event of table cells
  $("#myTable td").click(function() {
    if (allocationMode == true) {

      var opt = $(".list").val();
      var size = getShipSize(String(opt));

      if (rotation == true) //horizontally allocated
      {
        if (getCol(this) <= (11 - size)) {
          if (isFree(getCol(this), getRow(this), true, size, myTable)) {
            //removes just lecoted ship form the list
            var list = document.getElementsByClassName("list")[0];
            list.remove(list.selectedIndex);
            if ($(".list option").length != 0)
              list.value = document.getElementsByTagName("option")[0].innerHTML;
            //grayes cell where ship is allocated and disactive hover for the celss
            $(this).data("ishover", false);
            $(this).css("background-color", "gray");
            //allocation process is also presented on the map array
            myTable[getCol(this) - 1][getRow(this) - 1] = 1;
            for (i = 1; i < size; i++) {
              $(this).parent().children().eq(getCol(this) + i).data("ishover", false);
              $(this).parent().children().eq(getCol(this) + i).css("background-color", "gray");

              myTable[getCol(this) + i - 1][getRow(this) - 1] = 1;
            }
            markNeighborCells(getCol(this), getRow(this), true, size, myTable, 2);
          }

        }
      } else //similiar event happens for vertically allocated ships
      {
        if (getRow(this) <= (11 - size)) {
          if (isFree(getCol(this), getRow(this), false, size, myTable)) {
            var list = document.getElementsByClassName("list")[0];
            list.remove(list.selectedIndex);
            if ($(".list option").length != 0)
              list.value = document.getElementsByTagName("option")[0].innerHTML;
            $(this).data("ishover", false);
            $(this).css("background-color", "gray");
            myTable[getCol(this) - 1][getRow(this) - 1] = 1;
            for (i = 1; i < size; i++) {
              $(this).parent().parent().children().eq(getRow(this) + i).children().eq(getCol(this)).data("ishover", false);
              $(this).parent().parent().children().eq(getRow(this) + i).children().eq(getCol(this)).css("background-color", "gray");
              myTable[getCol(this) - 1][getRow(this) + i -1] = 1;
            }
            markNeighborCells(getCol(this), getRow(this), false, size, myTable, 2);
          }
        }
      }
      if ($(".list option").length == 0) {
        prepareGame();
      }

    }
  })

  $("#enemyTable td").hover(function() {
      if ($(this).data("ishover") != false)
        $(this).css("background-color", "#25ABC4");

    },
    function() {
      if ($(this).data("ishover") != false)
        $(this).css("background-color", "#73CEDF");
    })

  function markCell(col, row, isMyTable, color) {
    if (isMyTable == true) {
      $("#myTable").children().eq(0).children().eq(row).children().eq(col).css("background-color", color)
    } else {
      $("#enemyTable").children().eq(0).children().eq(row).children().eq(col).css("background-color", color)
    }

  }

  function checkTable(table) {
    for (i = 0; i < 10; i++) {
      for (j = 0; j < 10; j++) {
        if (table[i][j] == 1)
          return false;
      }
    }
    return true;
  }
  function disapearWinningText(alert){alert.fadeOut(3000, reset)};

  function checkIfWins() {
    var winner = false;
    var text = "";
    if (checkTable(myTable) == true) {
      $("#enemyTable td").data('isclick', false);
      text = "Computer is the winner!<br>Try again!";
      winner = true;
    } else
    if (checkTable(enemyTable)) {
      $("#enemyTable td").data('isclick', false);
      text = "Your are the winner!<br>Congratulations!";
      winner = true;
    }
    if (winner) {
      alert = $("<span>" + text + "</span>");
      alert.css("position", "absolute");
      xpos = ($("#myTable").position().left + $("#enemyTable").position().left) / 2;
      ypos = (2 * $("#myTable").position().top + $("#enemyTable").position().top) / 2;
      alert.css("top", ypos);
      alert.css("left", xpos);
      alert.css("color", "#FF8900");
      alert.css("font-size", "40px");
      alert.css("text-shadow", "0px 0px 5px black")
      $("body").append(alert);
      alert.fadeIn(3000,setTimeout(3000,disapearWinningText(alert)));
    }
  }

  function computerTry() {
    generateBestpoint();
    var continueshotting = true;
    if (myTable[bestCol - 1][bestRow - 1] == 1) {
      markCell(bestCol, bestRow, true, "#26470A");
      updateValTable(bestCol, bestRow, true)
      myTable[bestCol - 1][bestRow - 1] = 3;
      if (ifShipDestroyed(bestCol, bestRow, myTable))
        markDestroyedShipSides(false);
    } else {
      updateValTable(bestCol, bestRow, false);
      if (myTable[bestCol - 1][bestRow - 1] == 0 || myTable[bestCol - 1][bestRow - 1] == 2) {
        markCell(bestCol, bestRow, true, "red");
        continueshotting = false;
      }
    }
    return continueshotting;
  }
  function computerTries2()
  {
  var continueShotting = true;
        continueShotting=computerTry();
        checkIfWins();
        if(continueShotting==false)
         {
          clearInterval(intervalIndex);
          playerTry = true;
          $("#tablediv").css("box-shadow"," 0px 0px 10px 5px #014451").promise().done(function(){
            $("#Ctablediv").css("box-shadow"," 0px 0px 10px 5px yellow").promise();
          });
         }
  }

   function computerTries() {
    if (playerTry == false) {
      $("#tablediv").css("box-shadow"," 0px 0px 10px 5px yellow").promise().done(computerTries2);

        }
  }
  $("#enemyTable td").click(function() {
    if ($(this).data("isclick") != false) {


      if (playingMode == true) {
        if (playerTry == true) {
          var col = getCol(this);
          var row = getRow(this);
          if (enemyTable[col - 1][row - 1] == 1) {
            markCell(col, row, false, "#26470A");
            enemyTable[col - 1][row - 1] = 3;
            if (ifShipDestroyed(col, row, enemyTable))
              markDestroyedShipSides(true);
            checkIfWins();
          } else {
            markCell(col, row, false, "red");
            playerTry = false;
          }
          $(this).data('ishover', false);
          $(this).data('isclick', false);
          if(playerTry==false)
          {
          $("#Ctablediv").css("box-shadow"," 0px 0px 10px 5px #014451").promise().done(function(){
                      $("#tablediv").css("box-shadow"," 0px 0px 10px 5px yellow").promise();

          });
          intervalIndex=setInterval(computerTries,3000);
          }
        }
      }
    }

  });

  $("#rotate").click(function() {
      if (rotation == true)
        rotation = false
      else
        rotation = true;
    })
    //start button's click event
  $("#startButton").click(function() {
    initValtable();

    $("#textDiv").html("<span>Please, allocate your fleet</span>");
    $("#rotate").css("visibility", "visible");
    $("#auto").css("visibility", "visible");
    try {
      var list = $("<select size='4'></select>")
      $(list).addClass("list").width(200);
      $("#ships").append($(list));
      //aadding small ships to the list
      for (i = 1; i < 5; i++) {
        var option = $("<option>Small Ship " + i + "</option>");
        option.value = "1";
        $(list).append(option);

      }
      //adding averega ships to the list
      for (i = 1; i < 4; i++) {
        var option = $("<option>Average Ship " + i + "</option>");
        option.value = "2";
        $(list).append(option);
      }
      //adding big ships to the list
      for (i = 1; i < 3; i++) {
        var option = $("<option>Big Ship " + i + "</option>");
        option.value = "3";
        $(list).append(option);
      }
      //adding giant ship to the list
      var option = $("<option>Giant Ship</option>");
      option.value = "4";
      $(list).append(option);

      //select default option
      $(list).val("Small Ship 1");
      //now player can allocate his/her fleet on map
      allocationMode = true;

      $(this).attr("disabled", true);

    } catch (ex) {
      alert(ex);
    }
  });
  $("#auto").click(function() {
    if (allocationMode == true) {
      fillTable(myTable);
      $("#myTable td").css("background-color", "#73CEDF");
      autoAllocation(myTable);
      visualiseTable(true);
      prepareGame();

    }
  });

  function reset() {
    playingMode = false;
    allocationMode = false;
    rotation = true;
    playerTry = true;
    $("#myTable td").data('ishover', true);
    $("#enemyTable td").data('ishover', true);
    $("#myTable td").data('isclick', true)
    $("#enemyTable td").data('isclick', true);
    $("#enemyTable td").css("background-color", "#73CEDF");
    $("#myTable td").css("background-color", "#73CEDF");
    $("#startButton").attr("disabled", false);
    $("#rotate").attr("disabled", false);
    $("#auto").attr("disabled", false);
    $("#rotate").css("visibility", "hidden");
    $("#auto").css("visibility", "hidden");
    $("#textDiv").html("");
    $("#ships").html("");
    $("#Ctablediv").css("box-shadow"," 0px 0px 10px 5px #014451");
    $("#tablediv").css("box-shadow"," 0px 0px 10px 5px #014451").promise();
    fillTable(myTable);
    fillTable(enemyTable);
    initValtable();
  }
  $("#resetButton").click(function() {
    reset();
  });

});
