const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const puzzleStrings = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

let solver = new Solver;

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
        assert.equal(solver.validate(puzzleStrings[0][0]), true);
    });
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        assert.equal(solver.validate('A.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), false);
        assert.equal(solver.validate('1.5..2.84..63.12.7.2..5.....0..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), false);
        assert.equal(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37,'), false);
    });
    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        assert.equal(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'), false);
        assert.equal(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.3'), false);
    });
    test('Logic handles a valid row placement', () => {
        assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                                              4, 3, 5), true);
    });
    test('Logic handles an invalid row placement', () => {
        assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                                              4, 3, 8), false);
    });
    test('Logic handles a valid column placement', () => {
        assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                                              4, 3, 5), true);
    }); 
    test('Logic handles an invalid column placement', () => {
        assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                                              4, 3, 6), false);
    });
    test('Logic handles a valid region (3x3 grid) placement', () => {
        assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                                              4, 3, 5), true);
    });
    test('Logic handles an invalid region (3x3 grid) placement', () => {
        assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                                              4, 3, 2), false);
    });
    test('Valid puzzle strings pass the solver', () => {
        const result = solver.solve('.................................................................................');
        assert.isString(result);
        assert.lengthOf(result, 81); 
    });
    test('Invalid puzzle strings fail the solver', () => {
        assert.isUndefined(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37,'));
        assert.isUndefined(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.1'));
        assert.isUndefined(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37'));
    });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
        for (let i = 0; i < puzzleStrings.length; i++) {
            assert.equal(solver.solve(puzzleStrings[i][0]), puzzleStrings[i][1]);
        }
    });

});
