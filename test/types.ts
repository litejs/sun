
import { sun } from "../types/sun"

const data = sun(59.437, 24.753, "2025-03-20T12:00:00Z")

data.time        // Date
data.decl        // number
data.dur         // number
data.el          // number
data.elTrue      // number
data.eqTime      // number
data.hourAngle   // number
data.azimuth     // number
data.dist        // number
data.rightAsc    // number

const noon = data.noon        // SunData
noon.time                     // Date

const rise = data.rise        // SunData | null
if (rise) rise.time           // Date

const set = data.set          // SunData | null
if (set) set.time             // Date

// accepts Date
sun(0, 0, new Date())
// accepts number
sun(0, 0, Date.now())
