!function(exports, Math) {
	exports.sun = function sun(lat, lon, time, recalc) {
		time = new Date(time)

		var tmp
		, acos = Math.acos
		, cos = Math.cos
		, sin = Math.sin
		, tan = Math.tan
		, PI = Math.PI
		, rad = PI / 180
		, dayMs = 86400000
		, startOfDay = Math.floor(time / dayMs) * dayMs

		// Julian Century
		, JC = (time / dayMs - 10957.5) / 36525
		, cosLat = cos(rad * lat)
		, sinLat = sin(rad * lat)

		// Mean Longitude of the Sun
		, lonMean = rad * (280.46646 + JC * (36000.76983 + JC*0.0003032))
		// Mean Anomaly of the Sun
		, anomMean = rad * (357.52911 + JC * (35999.05029 - 0.0001537 * JC))
		// Mean Obliquity of the Ecliptic (degrees)
		, obliqMean = 23 + (26 + (21.448 - JC*(46.8150 + JC*(0.00059 - JC*0.001813)))/60)/60
		// Corrected Obliquity
		, obliqCorr = rad * (obliqMean + 0.00256 * cos(tmp = rad * (125.04 - 1934.136 * JC)))

		// Sun's Equation of Center
		, sunEqCtr = sin(anomMean) * (1.914602 - JC * (0.004817 + 0.000014 * JC)) + sin(2 * anomMean) * (0.019993 - 0.000101 * JC) + sin(3 * anomMean) * 0.000289

		// Apparent Longitude of the Sun
		, lonApp = lonMean + rad * (sunEqCtr - 0.00569 - 0.00478 * sin(tmp))

		// Declination of the Sun
		, declRad = Math.asin(sin(obliqCorr) * sin(lonApp))
		, sinDecl = sin(declRad)
		, cosDecl = cos(declRad)

		// Eccentricity of Earth's Orbit
		, earthEccent = 0.016708634 - JC * (0.000042037 + 0.0000001267 * JC)
		, varY = (tmp = tan(obliqCorr / 2)) * tmp

		// Equation of Time (minutes)
		, eqTime = 4 * (
			varY * sin(2 * lonMean) -
			2 * earthEccent * sin(anomMean) +
			4 * earthEccent * varY * sin(anomMean) * cos(2 * lonMean) -
			0.5 * varY * varY * sin(4 * lonMean) -
			1.25 * earthEccent * earthEccent * sin(2 * anomMean)
		) / rad

		// Hour Angle at Sunrise (degrees)
		, hourAngleRise = acos((cos(rad * 90.833) - sinLat * sinDecl) / (cosLat * cosDecl)) / rad

		// True Solar Time (minutes)
		, sunTime = (time / 60000 + eqTime + 4 * lon) % 1440
		, hourAngle = sunTime < 0 ? sunTime / 4 + 180 : sunTime / 4 - 180

		// Solar Zenith/Elevation
		, cosZenith = sinLat * sinDecl + cosLat * cosDecl * cos(rad * hourAngle)
		, elTrue = 90 - acos(cosZenith) / rad
		// Atmospheric Refraction Correction (degrees)
		, atmCorr = (
			elTrue > 85 ? 0 : (tmp = tan(rad * elTrue),
				elTrue > 5 ? 58.1 / tmp - 0.07 / (tmp*tmp*tmp) + 0.000086 / (tmp*tmp*tmp*tmp*tmp) :
				elTrue > -0.575 ? 1735 + elTrue * (-518.2 + elTrue * (103.4 + elTrue * (-12.79 + elTrue * 0.711))) :
				-20.774 / tmp
			) / 3600
		)

		// Solar Noon (minutes)
		, noon = 720 - 4 * lon - eqTime
		// Sunrise & Sunset Time (minutes)
		, rise = noon - hourAngleRise * 4
		, set = noon + hourAngleRise * 4

		if (recalc) {
			tmp = Math.round((recalc === "rise" ? rise : recalc === "set" ? set : noon) * 60) * 1000
			time.setTime(startOfDay + tmp)
		}

		return {
			time,
			decl: declRad / rad,
			dur: 8 * hourAngleRise,          // Total Sunlight Duration (minutes)
			el: elTrue + atmCorr,            // Solar Elevation (Corrected for Refraction)
			elTrue,
			eqTime,
			hourAngle,
			get azimuth() {
				return (tmp = acos((sinLat * cosZenith - sinDecl) / (cosLat * Math.sqrt(1 - cosZenith * cosZenith))), hourAngle > 0 ? tmp + PI : 3 * PI - tmp) * 180 / PI % 360
			},
			get dist() {
				return 1.000001018 * (1 - earthEccent * earthEccent) / (1 + earthEccent * cos(anomMean + rad * sunEqCtr)) // Distance to Sun (Astronomical Units)
			},
			get rightAsc() {
				return Math.atan2(cos(obliqCorr) * sin(lonApp), cos(lonApp)) / rad   // Right Ascension of the Sun (degrees)
			},
			get noon() {
				return findNext("noon", noon, -1)
			},
			get rise() {
				return findNext("rise", rise, 1)
			},
			get set() {
				return findNext("set", set, -1)
			},
		}

		function findNext(key, minutes, inc) {
			if (minutes === minutes) return sun(lat, lon, startOfDay + minutes * 60000, key)
			var day = startOfDay, i = 366, d = (time - Date.UTC(time.getUTCFullYear(), 0, 0)) / dayMs
			for (inc *= (lat > 66.4 && d > 79 && d < 267 || lat < -66.4 && (d < 83 || d > 263)) ? -dayMs : dayMs; i--; )
				if ((d = sun(lat, lon, day += inc)).dur === d.dur) return d[key]
			return null
		}
	}
}(this, Math) // jshint ignore:line
