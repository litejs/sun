
var sun = require('../sun.js').sun

describe("calc", () => {

	describe.assert.close = function(actual, expected, eps = 1e-6, epsRel = 1e-6) {
		var diff = Math.abs(actual - expected)
		, relDiff = diff / Math.max(Math.abs(actual), Math.abs(expected))
		return this(
			actual === expected ||
			diff < eps ||
			relDiff < epsRel ||
			(actual !== actual) && (expected !== expected),
			"close diff:"+diff+" relDiff:"+relDiff, actual, expected
		)
	}

	function timeString(val, ref) {
		if (!val) return val
		var s = new Date(val).toJSON()
		return s.slice(0, 10) === ref ? s.slice(11, 19) : s.slice(0, 19)
	}

	describe("{0}", [
		[ "Tallinn", 59.44, 24.75, [
			[ "2025-09-24T15:06:00Z", "04:10:14", "10:12:59", "16:14:24", { azimuth: 255.131 } ],
		]],

		[ "edge-case", 70, 0, [
			[ "2025-06-21T12:00:00Z", "2025-05-16T00:13:51", "12:01:52", "2025-07-28T23:17:11", { azimuth: 179.408 } ],
		]],

		[ "far-east", 0, 170, [
			[ "2025-03-20T12:00:00Z", "2025-03-18T18:44:15", "00:47:30", "06:50:45", { azimuth: 270.253 } ],
		]],

		[ "south-polar", -70, 25, [
			[ "2025-12-21T12:00:00Z", "2025-11-15T22:37:56", "10:18:10", "2026-01-25T21:45:46", { azimuth: 328.463 } ],
		]],

		[ "pre-1970", 59, 25, [
			[ "1960-06-21T06:00:00Z", "01:06:22", "10:21:39", "19:36:56", { azimuth: 98.35 } ],
		]],

		[ "polar-night", 85, 25, [
			[ "2025-01-06T10:30:00Z", "2025-03-06T09:06:36", "10:25:55", "2024-10-07T10:38:51", { azimuth: 180.9885 } ],
		]],

		[ "north-pole", 90, 0, [
			[ "2025-06-21T12:00:00Z", null, "12:01:52", null, { azimuth: 171.1492 } ],
		]],

	], (name, lat, lon, tests) => {
		test("-> {0}", tests, (time, rise, noon, set, map, assert) => {
			let data = sun(lat, lon, time)
			, ref = time.slice(0, 10)
			assert.equal(data.rise && timeString(data.rise.time, ref), rise)
			assert.equal(data.noon && timeString(data.noon.time, ref), noon)
			assert.equal(data.set && timeString(data.set.time, ref), set)
			assert.close(data.azimuth, map.azimuth)
			assert.end()
		})
	})

	describe("{0} {1} {2}", [

		[ 59, 25, "2025-01-28T00:06:00Z"
		, [ 0.984812549795269, -49.2642744156472, -18.1855641304802, -12.89491411549, 470.944046963964, -156.723728528873, -45.8077850781221, -45.8021755235088, 32.5870424744197 ] ],

		[ 59, 25, "2025-01-28T06:42:00Z"
		, [ 0.984846051709452, -48.9803520856541, -18.112823711759, -12.9468116251495, 472.189417452595, -57.7367029062873, -0.296514175210348, 0.230731260685179, 126.513969632275 ] ],

		[ 59, 25, "2025-01-28T07:42:00Z"
		, [ 0.98485115817937, -48.9373558566337, -18.1017665815725, -12.954585283975, 472.378457459244, -42.7386463209938, 5.34912740741183, 5.50112423492961, 139.617488382515 ] ],

		[ 59, 25, "2025-01-28T10:30:00Z"
		, [ 0.984865498833595, -48.8169976609889, -18.0707565661179, -12.9762259971898, 472.908252087059, -0.744056499297443, 12.9268164068455, 12.9955606438428, 179.27425276415 ] ],

		[ 70, 25, "2025-01-06T10:30:00Z"
		, [ 0.983324965463882, -72.2598699724219, -22.4368649967931, -5.91865687138743, NaN, 1.02033578215315, -2.439739616890364, -2.3043035964525473, 180.943945491484 ] ],

		[ 59, 25, "1999-01-01T12:00:00Z"
		, [ 0.9833048590414829, -78.44844515583624, -23.0124740194425, -3.4180395260228598, 379.6178574764111, 24.145490118302405, 5.594226719167025, 5.7409528818416975, 202.2286776416348 ] ],

	], (lat, lon, time, a) => {
		let data = sun(lat, lon, time)

		test("dist",          assert => assert.close(data.dist,          a[0]).end())
		test("rightAsc",      assert => assert.close(data.rightAsc,      a[1]).end())
		test("decl",          assert => assert.close(data.decl,          a[2]).end())
		test("eqTime",        assert => assert.close(data.eqTime,        a[3]).end())
		test("dur",           assert => assert.close(data.dur,           a[4]).end())
		test("hourAngle",     assert => assert.close(data.hourAngle,     a[5]).end())
		test("elTrue",        assert => assert.close(data.elTrue,        a[6]).end())
		test("el",            assert => assert.close(data.el,            a[7]).end())
		test("azimuth",       assert => assert.close(data.azimuth,       a[8]).end())
	})
})
