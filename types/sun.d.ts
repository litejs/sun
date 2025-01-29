interface SunData {
	time: Date
	decl: number
	dur: number
	el: number
	elTrue: number
	eqTime: number
	hourAngle: number
	readonly azimuth: number
	readonly dist: number
	readonly rightAsc: number
	readonly noon: SunData
	readonly rise: SunData | null
	readonly set: SunData | null
}

export declare function sun(lat: number, lon: number, time: Date | string | number): SunData
