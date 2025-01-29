
[1]: https://badgen.net/coveralls/c/github/litejs/sun
[2]: https://coveralls.io/r/litejs/sun
[3]: https://packagephobia.now.sh/badge?p=@litejs/sun
[4]: https://packagephobia.now.sh/result?p=@litejs/sun
[5]: https://badgen.net/badge/icon/Buy%20Me%20A%20Tea/orange?icon=kofi&label
[6]: https://www.buymeacoffee.com/lauriro


LiteJS Sun &ndash; [![Coverage][1]][2] [![Size][3]][4] [![Buy Me A Tea][5]][6]
==========

Sun position and timing calculations based on NOAA solar equations.

```sh
$ npm install @litejs/sun
```

```javascript
import { sun } from "@litejs/sun"

let data = sun(59.437, 24.753, "2025-03-20T12:00:00Z")
console.log("Sunrise:", data.rise.time, "Sunset:", data.set.time)
// Sunrise: 2025-03-20T04:22:24.000Z Sunset: 2025-03-20T16:35:43.000Z
console.log("Azimuth:", data.azimuth, "Elevation:", data.el)
// Azimuth: 206.16 Elevation: 28.01
```

## API

### sun(lat, lon, time)

Returns an object with the following properties:

| Property       | Description                                  |
|----------------|----------------------------------------------|
| `time`         | Date object for the given time               |
| `decl`         | Solar declination (degrees)                  |
| `dur`          | Daylight duration (minutes)                  |
| `el`           | Solar elevation with refraction (degrees)    |
| `elTrue`       | Solar elevation without refraction (degrees) |
| `eqTime`       | Equation of time (minutes)                   |
| `hourAngle`    | Solar hour angle (degrees)                   |
| `azimuth`      | Solar azimuth (degrees, lazy)                |
| `dist`         | Distance to sun in AU (lazy)                 |
| `rightAsc`     | Right ascension (degrees, lazy)              |
| `noon`         | Solar noon data (lazy)                       |
| `rise`         | Sunrise data (lazy)                          |
| `set`          | Sunset data (lazy)                           |

The `noon`, `rise`, and `set` getters return objects with the same structure, with `time` refined to the exact event.
During polar day or polar night, `rise` and `set` find the nearest event, which may be days or months away.
Returns `null` only at extreme latitudes (e.g., the poles) where no sunrise or sunset occurs within a year.

## Contributing

Follow [Coding Style Guide](https://github.com/litejs/litejs/wiki/Style-Guide),
run tests `npm install; npm test`.


> Copyright (c) 2025 Lauri Rooden &lt;lauri@rooden.ee&gt;  
[MIT License](https://litejs.com/MIT-LICENSE.txt) |
[GitHub repo](https://github.com/litejs/sun) |
[npm package](https://npmjs.org/package/@litejs/sun) |
[Buy Me A Tea][6]

