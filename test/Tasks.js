require('../nodash').install([ '$', GLOBAL ]);
var assert = require('assert');

describe('Tasks', function () {

    it('run (waterfall)', function (done) {
        var P = require('../nodash').install({}, { dontUseNatives: true });
        var invocations = 0;
        P.run([
            function (callback) {
                invocations += 1;
                callback(1);
            },
            function (data, callback) {
                invocations += 1;
                assert.strictEqual(1, data);
                callback(2);
            },
            function (data, callback) {
                invocations += 1;
                assert.strictEqual(2, data);
                callback(3);
            },
            function (data, callback) {
                invocations += 1;
                assert.strictEqual(3, data);
                callback(4);
            }
        ], function (results) {
            assert.deepEqual({ 3: { result: 4 } }, results);
            assert.strictEqual(4, invocations);
            done();
        });
    });

    it('run', function (done) {
        var P = require('../nodash').install({}, { dontUseNatives: true });
        var invocations = 0;
        P.run({
            eins: function (callback) {
                invocations += 1;
                callback(1);
            },
            zwei: [function (callback) {
                invocations += 1;
                callback(2);
            }],
            drei: ['eins', 'vier', function (eins, vier, callback) {
                invocations += 1;
                assert.strictEqual(1, eins);
                assert.strictEqual(4, vier);
                callback(3);
            }],
            vier: ['eins', function (eins, callback) {
                invocations += 1;
                assert.strictEqual(1, eins);
                callback(4);
            }]
        }, function (results) {
            assert.strictEqual(4, invocations);
            done();
        });
    });

    it('run /w exception', function (done) {
        var P = require('../nodash');
        var invocations = 0;
        P.run({
            eins: function (callback) {
                invocations += 1;
                callback(1);
            },
            zwei: [function (callback) {
                invocations += 1;
                callback(2);
            }],
            drei: ['eins', 'vier', function (eins, vier, callback) {
                invocations += 1;
                assert.strictEqual(1, eins);
                assert.strictEqual(4, vier);
                callback(3);
            }],
            vier: ['eins', function (eins, callback) {
                invocations += 1;
                throw new Error('Aww Snap!');
            }]
        }, function (results) {
            assert.strictEqual(3, invocations);
            done();
        });
    });

    it('run /w exception + .runOnError', function (done) {
        var P = require('../nodash');
        var invocations = 0;
        P.run({
            eins: {
              func: function (callback) {
                invocations += 1;
                callback(1);
              }
            },
            zwei: [function (callback) {
                invocations += 1;
                callback(2);
            }],
            drei: ['eins', 'vier', {
              func: function (eins, vier, callback) {
                invocations += 1;
                assert.strictEqual(1, eins);
                assert.strictEqual(4, vier);
                callback(3);
              },
              runOnError: true
            }],
            vier: ['eins', function (eins, callback) {
                invocations += 1;
                throw new Error('Aww Snap!');
            }]
        }, function (results) {
            assert.strictEqual(4, invocations);
            done();
        });
    });

    it('run /w exception + .runOnError (function identity)', function (done) {
        var P = require('../nodash');
        var invocations = 0;
        P.run({
            eins: {
              func: function (callback) {
                invocations += 1;
                callback(1);
              }
            },
            zwei: [function (callback) {
                invocations += 1;
                callback(2);
            }],
            drei: ['eins', 'vier', {
              func: function (eins, vier, callback) {
                invocations += 1;
                assert.strictEqual(1, eins);
                assert.strictEqual(4, vier);
                callback(3);
              },
              runOnError: P.id
            }],
            vier: ['eins', function (eins, callback) {
                invocations += 1;
                throw new Error('Aww Snap!');
            }]
        }, function (results) {
            assert.strictEqual(4, invocations);
            done();
        });
    });

    it('run /w exception + .runOnError (return missing)', function (done) {
        var P = require('../nodash');
        var invocations = 0;
        P.run({
            eins: {
              func: function (callback) {
                invocations += 1;
                callback(1);
              }
            },
            zwei: [function (callback) {
                invocations += 1;
                callback(2);
            }],
            drei: ['eins', 'vier', {
              func: function (eins, vier, callback) {
                invocations += 1;
                callback(3);
              },
              runOnError: function (results) {
                  
              }
            }],
            vier: ['eins', function (eins, callback) {
                invocations += 1;
                throw new Error('Aww Snap!');
            }]
        }, function (results) {
            assert.strictEqual(4, invocations);
            done();
        });
    });

    it('run /w exception + .runOnError (terse syntax)', function (done) {
        var P = require('../nodash');
        var invocations = 0;
        P.run({
            eins: {
              func: function (callback) {
                invocations += 1;
                callback(1);
              }
            },
            zwei: [function (callback) {
                invocations += 1;
                callback(2);
            }],
            drei: {
              func: function (eins, vier, callback) {
                invocations += 1;
                callback(3);
              },
              depends: ['eins', 'vier'],
              runOnError: P.id
            },
            vier: ['eins', function (eins, callback) {
                invocations += 1;
                throw new Error('Aww Snap!');
            }]
        }, function (results) {
            assert.strictEqual(4, invocations);
            done();
        });
    });

    it('run /w async', function (done) {
        $run({
            eins: function (callback) {
                callback(2);
            },
            zwei: [ 'eins', async(plus(3)) ]
        }, function (results) {
            assert.strictEqual(5, results.zwei.result);
            done();
        });
    });

    it('run /w async + exception', function (done) {
        $run({
            eins: function (callback) {
                callback(2);
            },
            zwei: [ 'eins', async(function () { throw "error"; }) ]
        }, function (results) {
            assert.strictEqual("error", results.zwei.error);
            done();
        });
    });
   
    it('run /w async + error', function (done) {
        $run({
            eins: function (callback) {
                callback(2);
            },
            zwei: [ 'eins', function (result, callback) {
                callback(2, "error");
            } ]
        }, function (results) {
            assert.strictEqual("error", results.zwei.error);
            done();
        });
    });
     
    it('run, error: unmet dependencies', function (done) {
        $run({
            eins: {
              func: function (callback) {
                callback(2);
              },
              depends: [ 'zwei' ]
            }
        }, function (results, error) {
            assert.deepEqual({
                message: "unmet dependencies",
                details: [ '`eins` depends on `zwei` which is not defined' ]
            }, error);
            done();
        });
    });

    it('run, error: cycle detected', function (done) {
        $run({
            zero: [ async(constant(2)) ],

            one: [ 'two', 'zero', async(id) ],

            two: [ 'one', async(id) ],

            three: [ 'two', async(id) ]
        }, function (results, error) {
            assert.deepEqual({
                message: "cycle detected",
                details: [ 'one -> two -> one' ]
            }, error);
            done();
        });
    });

    it('run, error: no initial task', function (done) {
        $run({
            zero: [ 'three', async(constant(2)) ],

            one: [ 'two', 'zero', async(id) ],

            two: [ 'one', async(id) ],

            three: [ 'two', async(id) ]
        }, function (results, error) {
            assert.deepEqual({
                message: "no initial task",
                details: "There is no task without any dependencies."
            }, error);
            done();
        });
    });

});
