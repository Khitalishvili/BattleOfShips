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

var bestCol, bestRow; // position for computer's choice

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
            valTable[i][j]=2;
      }
    }
    //incresing around shotting point
    for (i = 1; i < 4; i++) {
      if (isValidCell(col + i, row) && !isShotValTable(col + i, row)) {
        valTable[col + i - 1][row - 1] += (30 - i);
      }
      if (isValidCell(col - i, row) && !isShotValTable(col - i, row)) {
        valTable[col - i - 1][row - 1] += (30 - i);
      }
      if (isValidCell(col, row + i) && !isShotValTable(col, row + i)) {
        valTable[col - 1][row + i - 1] += (30 - i);
      }
      if (isValidCell(col, row - i) && !isShotValTable(col, row - i)) {
        valTable[col - 1][row - i - 1] += (30 - i);
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
