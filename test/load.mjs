
import { sun } from "../sun.js"

describe("Run as ESM module", () => {
	it("should have function createZip", assert => {
		assert.type(sun, "function")
		assert.end()
	})
})

