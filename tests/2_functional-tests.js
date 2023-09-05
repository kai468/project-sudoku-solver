const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    // endpoint /api/solve: 
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        const query = {
            puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
        };
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .set('content-type', 'application/json; charset=utf-8')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, '218396745753284196496157832531672984649831257827549613962415378185763429374928561');
                done(); 
            });
    });
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        const query = {
            puzzle: ''
        };
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .set('content-type', 'application/json; charset=utf-8')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field missing');
                done(); 
            });
    });
    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        const query = {
            puzzle: '..839.7.575.....964..1...a...16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
        };
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .set('content-type', 'application/json; charset=utf-8')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done(); 
            });
    });
    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        const query = {
            puzzle: '..839.7.575.....964..1......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'
        };
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .set('content-type', 'application/json; charset=utf-8')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done(); 
            });
    });
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        const query = {
            puzzle: '218396745753281.96496157832531672984649831257827549613962415378185763429374928561'
        };
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .set('content-type', 'application/json; charset=utf-8')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done(); 
            });
    });

    // endpoint /api/check:
    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
        const query = {
            puzzle: "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
            coordinate: "i9",
            value: "1"
        }
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, true); 
                done(); 
            });
    });

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
        const query = {
            puzzle: "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
            coordinate: "G7",
            value: "1"
        }
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false); 
                assert.equal(res.body.conflict.length, 1);
                done(); 
            });
    });

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
        const query = {
            puzzle: "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
            coordinate: "i7",
            value: "9"
        }
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 2); 
                done(); 
            });
    });

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
        const query = {
            puzzle: "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
            coordinate: "i7",
            value: "2"
        }
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false);
                assert.equal(res.body.conflict.length, 3); 
                done(); 
            });
    });

    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
        const query = {
            puzzle: "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
            coordinate: "i7",
            value: ""
        }
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, undefined);
                assert.equal(res.body.error, "Required field(s) missing");
                done(); 
            });
    });

    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
        const query = {
            puzzle: "..839.7.575.....964..1....,..16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
            coordinate: "i7",
            value: "1"
        }
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, undefined);
                assert.equal(res.body.error, "Invalid characters in puzzle");
                done(); 
            });
    });

    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
        const query = {
            puzzle: "..839.7.575.....964..1.......16.29846.9.312.7..754...3..62..5.78.8...3.2...492...1",
            coordinate: "i7",
            value: "5"
        }
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, undefined);
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                done(); 
            });
    });

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
        const query = {
            puzzle: "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
            coordinate: "i10",
            value: "5"
        }
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, undefined);
                assert.equal(res.body.error, "Invalid coordinate");
                done(); 
            });
    });

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
        const query = {
            puzzle: "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
            coordinate: "i7",
            value: "0"
        }
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            //.set('content-type', 'application/json; charset=utf-8')
            .send(query)
            .end( (req, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, undefined);
                assert.equal(res.body.error, "Invalid value");
                done(); 
            });
    });

});

