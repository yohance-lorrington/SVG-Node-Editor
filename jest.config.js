module.exports = {
	transform: {
	  "^.+\\.tsx?$": "ts-jest",
	},
	testPathIgnorePatterns: ["/crap/", "/node_modules/"],
	testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};