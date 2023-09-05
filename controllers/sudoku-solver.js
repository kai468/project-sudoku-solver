class SudokuSolver {
  /* per definition: 
    This class is 0-based.
    For input variables "row" and "column" an integer value between 0 and 8 is expected. 
    For input variable "value" an integer (1-9) is expected. 
    It's the caller function's responsibility to convert e.g. A-I for rows to 0-8 and 1-9 for columns to 0-8. 
    
    --> Indices of puzzleString: 
           1  2  3  4  5  6  7  8  9    i
        A 00 01 02 03 04 05 06 07 08    0
        B 09 10 11 12 13 14 15 16 17    1
        C 18 19 20 21 22 23 24 25 26    2
        D 27 28 29 30 31 32 33 34 35    3
        E 36 37 38 39 40 41 42 43 44    4
        F 45 46 47 48 49 50 51 52 53    5
        G 54 55 56 57 58 59 60 61 62    6
        H 63 64 65 66 67 68 69 70 71    7
        I 72 73 74 75 76 77 78 79 80    8

        i  0  1  2  3  4  5  6  7  8
  */

  validate(puzzleString) {
    const regex = /^[.1-9]{81}$/
    return Boolean(regex.exec(puzzleString));
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // extract row:
    /*
      row = 0 --> i = 0 - 8   -> substring(0, 9)
      row = 1 --> i = 9 - 17  -> substring(9, 18)
      ...
      row = 7 --> i = 63 - 71 -> substring(65, 72)
      row = 8 --> i = 72 - 80 -> substring(72, 81)
      --> substring(row * 9, (row + 1) * 9)
    */
    const check = [...puzzleString.substring(row * 9, (row + 1) * 9)].map( (v) => Number(v));

    // pop the target field:
    check.splice(column, 1); 

    return !check.includes(value); 
  }

  checkColPlacement(puzzleString, row, column, value) {
    // extract column:
    /*
      column = 0 --> i = [0, 9, 18, 27, 36, 45, 54, 63, 72]
      column = 1 --> i = [1, 10, 19, 28, 37, 46, 55, 64, 73]
      ...
      column = 8 --> i = [8, 17, 26, 35, 44, 53, 62, 71, 80]
      --> i = [0, 1, 2, 3, ..., 8].map( (x) => x * 9 + column)
    */
    const indices = Array.from(Array(9).keys()).map( (i) => (i * 9 + column));
    // pop the target field:
    indices.splice(row, 1); 

    const check = [...puzzleString].filter( (x, i) => (indices.includes(i))).map( (v) => Number(v));

    return !check.includes(value); 
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // extract region: 
    const firstColumn = Math.floor(column / 3) * 3;
    const firstRow = Math.floor(row / 3) * 3;
    const firstIndex = firstRow * 9 + firstColumn;
    const indices = [
      ...Array.from(Array(3).keys()).map( (i) => (i + firstIndex)),
      ...Array.from(Array(3).keys()).map( (i) => (i + firstIndex + 9)),
      ...Array.from(Array(3).keys()).map( (i) => (i + firstIndex + 18))
    ];

    // pop the target field: 
    indices.splice((row - firstRow) * 3 + (column - firstColumn), 1);

    const check = [...puzzleString].filter( (x, i) => (indices.includes(i))).map( (v) => Number(v));

    return !check.includes(value);  
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      return undefined;
    }
    const puzzleArray = puzzleString.split("");

    for (let i = 0; i < 81; i++) {
      if (puzzleArray[i] == ".") {
        for (let v = 1; v <= 9; v++) {
          if (this._isSafe(puzzleArray.join(""), i, v)) {
            puzzleArray[i] = v.toString();
            const result = this.solve(puzzleArray.join(""));
            if (result) {
              return result;  // return solution if found
            }
            // dead end -> reset: 
            puzzleArray[i] = ".";
          }
        }
        return undefined; // if we reach this point, there's no valid solution
      }
    }
    // one full solution: 
    return puzzleArray.join("");
  }

  // utilities:
  _isSafe(puzzleString, index, value) {

    // convert index to row, column:
    const col = index % 9;
    const row = Math.floor(index/9);
    const regFirstI = (Math.floor(row / 3) * 9 + Math.floor(col / 3)) * 3;

    // refactored version: 
    // does not take into account popping the target field itself because it's only called 
    //    by the solving function -> target field is always empty (".").
    const neighbours = [...new Set([
                        ...Array.from(Array(9).keys()).map( (i) => (row * 9 + i)), 
                        ...Array.from(Array(9).keys()).map( (i) => (col + i * 9)), 
                        ...Array.from(Array(9).keys()).map( (i) => (regFirstI + (i % 3) + Math.floor(i / 3) * 9))
                      ].map( (i) => puzzleString[i]))]
                      .filter( (v) => (v != "."))
                      .map( (v) => Number(v)); 

    return !neighbours.includes(value);
  }

  _print(puzzleString) {
    // formatted output -> only for debugging: 
    let output = puzzleString[0];
    for (let i = 1; i < 81; i++){
      if (i % 9 == 0) {
        output += "\n";
      }
      output += puzzleString[i].toString();
    }
    console.log(output); 
  }

}

module.exports = SudokuSolver;

