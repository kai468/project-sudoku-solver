'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      // input validation: 
      /*
      1) puzzle, coordinate and value are not empty -> {"error":"Required field(s) missing"}
      2) puzzle is 81 char. long -> {"error":"Expected puzzle to be 81 characters long"}
      3) puzzle does not contain invalid characters -> {"error":"Invalid characters in puzzle"}
      4) value is valid (1-9 integer) -> {"error":"Invalid value"}
      5) coordinate is valid (A1-I9 / a1 - i9) -> {"error":"Invalid coordinate"}
      */
      try {

        if (!req.body.puzzle || !req.body.coordinate || !req.body.value) {
          res.json({
            error: 'Required field(s) missing'
          });
        } else if (req.body.puzzle.length != 81) {
          res.json({
            error: 'Expected puzzle to be 81 characters long'
          });
        } else if (!solver.validate(req.body.puzzle)) {
          res.json({
            error: 'Invalid characters in puzzle'
          });
        } else if (!/^\d+$/.test(req.body.value) || Number(req.body.value) < 1 || Number(req.body.value) > 9) {
          res.json({
            error: 'Invalid value'
          });
        } else if (!Boolean(/^[a-iA-I][1-9]$/.test(req.body.coordinate))) {
          res.json({
            error: 'Invalid coordinate'
          });
        } else {
          // inputs valid -> check placement: 

          const row = req.body.coordinate.toUpperCase().charCodeAt(0) - 65; 
          const column = Number(req.body.coordinate[1]) - 1; 
          const value = Number(req.body.value); 

          const conflict = [];
          !solver.checkRowPlacement(req.body.puzzle, row, column, value) && conflict.push('row');
          !solver.checkColPlacement(req.body.puzzle, row, column, value) && conflict.push('column');
          !solver.checkRegionPlacement(req.body.puzzle, row, column, value) && conflict.push('region');
          if (conflict.length == 0) {
            res.json({
              valid: true
            });
          } else {
            res.json({
              valid: false,
              conflict: conflict
            });
          }
        }
      } catch (err) {
        res.status(200).json({error: err});
      } 
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      /* cases to handle:
      1) valid request + solvable -> solution
      2) request: puzzle is missing -> {"error":"Required field missing"}
      3) request.length != 81 -> {"error":"Expected puzzle to be 81 characters long"}
      4) request contains invalid characters -> {"error":"Invalid characters in puzzle"}
      5) request has valid format but is not solvable -> {"error":"Puzzle cannot be solved"}
      */ 
      try {
        if (!req.body.puzzle) {
          res.json({
            error: "Required field missing"
          });
        } else {
          const solution = solver.solve(req.body.puzzle);
          if (solution) {
            res.json({
              solution: solution
            });
          // error cases: 
          } else if (req.body.puzzle.length != 81) {
            res.json({
              error: "Expected puzzle to be 81 characters long"
            });
          } else if (!solver.validate(req.body.puzzle)) {
            res.json({
              error: "Invalid characters in puzzle"
            });
          } else {
            res.json({
              error: "Puzzle cannot be solved"
            });
          }
        }
      } catch (err) {
        res.status(200).json({error: err});
      }
      
    });
};
