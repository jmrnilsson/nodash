require('../prelude').install(GLOBAL);
var assert = map(flip, require('assert'));

describe('Maybe', function () {

    it("maybe", function () {
        assert.strictEqual(8, maybe(8, constant(7), null));
        assert.strictEqual(7, maybe(8, constant(7), 9));
        assert.strictEqual(9, maybe(8, id, 9));
    });

    it("isJust", function () {
        assert.strictEqual(true, isJust(0));
        assert.strictEqual(true, isJust(10));
        assert.strictEqual(true, isJust({}));
        assert.strictEqual(true, isJust(""));
        assert.strictEqual(true, isJust("xyz"));
        assert.strictEqual(true, isJust([]));
        assert.strictEqual(false, isJust(null));
        assert.strictEqual(false, isJust(undefined));
    });

    it("isNothing", function () {
        assert.strictEqual(false, isNothing(0));
        assert.strictEqual(false, isNothing(10));
        assert.strictEqual(false, isNothing({}));
        assert.strictEqual(false, isNothing(""));
        assert.strictEqual(false, isNothing("xyz"));
        assert.strictEqual(false, isNothing([]));
        assert.strictEqual(true, isNothing(null));
        assert.strictEqual(true, isNothing(undefined));
    });

    it("fromMaybe", function () {
        assert.strictEqual("", fromMaybe(13, ""));
        assert.strictEqual(10, fromMaybe(13, 10));
        assert.strictEqual(0, fromMaybe(13, 0));
        assert.strictEqual(true, fromMaybe(13, true));
        assert.strictEqual(false, fromMaybe(13, false));
        assert.strictEqual(13, fromMaybe(13, null));
        assert.strictEqual(13, fromMaybe(13, undefined));
    });

    it("listToMaybe", function () {
        assert.strictEqual(9, listToMaybe([ 9, 10 ]));
        assert.strictEqual(true, isJust(listToMaybe([ 13 ])));
        assert.strictEqual(true, isNothing(listToMaybe([])));
    });

    it("listToMaybe /w stream", function () {
        assert.strictEqual(9, listToMaybe(repeat(9)));
    });

    it("maybeToList", function () {
        assert.deepEqual([ 9 ], maybeToList(9));
        assert.deepEqual([ ], maybeToList(null));
        assert.deepEqual([ ], maybeToList(undefined));
    });

    it("catMaybes", function () {
        assert.deepEqual(
            [ 7, 9, "hello", {} ],
            catMaybes([null, 7, 9, undefined, "hello", null, {}])
        );
    });

    it("mapMaybe", function () {
        assert.deepEqual(
            [ 2, 4 ],
            mapMaybe(function (x) { return even(x) ? x : null; }, [1,2,3,4,5])
        );
    });
});
