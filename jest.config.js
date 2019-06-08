module.exports = {
	transform: {
	  "^.+\\.tsx?$": "ts-jest",
	  "^.+\\.js?$": "babel-jest"
	},
	verbose: true,
	setupFilesAfterEnv: ["./src/setupTests.js"],
	testPathIgnorePatterns: ["/crap/", "/node_modules/"],
	testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};