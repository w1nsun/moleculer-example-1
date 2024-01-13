const { MoleculerError } = require("moleculer").Errors;

class OverflowError extends MoleculerError {
	constructor(msg, data) {
		super(msg || "Overflow error.", 500, OverflowError.TYPE, data);
	}
}

OverflowError.TYPE = "OVERFLOW_ERROR";

module.exports = {
	OPERATIONS_MAP: {
		"math.add": "add",
		"math.multiply": "multiply",
	},
	MULTIPLY_RES_OVERFLOW_LIMIT: 1000,
	OverflowError,
};
