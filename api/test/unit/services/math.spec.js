"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const MathService = require("../../../services/math.service");
const LoggerService = require("../../../services/logger.service");
const { OverflowError } = require("../../../src/infra/math");

describe("Test 'math' service", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(MathService);

	LoggerService.actions.log = jest.fn(() => Promise.resolve("Fake Log Sent"));
	let loggerService = broker.createService(LoggerService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'math.add' action", () => {

		it("should return Integer '9'", async () => {
			const res = await broker.call("math.add", { a: 7, b: 2 });
			expect(res).toBe(9);
		});

		it("should return Float '9.2'", async () => {
			const res = await broker.call("math.add", { a: 7.2, b: 2 });
			expect(res).toBe(9.2);
		});

		it("should return Validation Error (type)", async () => {
			try {
				await broker.call("math.add", {a: "7.2", b: 2});
			} catch (err) {
				expect(err).toBeInstanceOf(ValidationError);
				expect(err.type).toBe("VALIDATION_ERROR");
				expect(err.data).toBeDefined();
				expect(err.data[0].type).toBe("number");
				expect(err.data[0].message).toBe("The 'a' field must be a number.");
				expect(err.data[0].field).toBe("a");
				expect(err.data[0].actual).toBe("7.2");
			}
		});

		it("should return Validation Error (numberMin)", async () => {
			try {
				await broker.call("math.add", {a: -101, b: 2});
			} catch (err) {
				expect(err).toBeInstanceOf(ValidationError);
				expect(err.type).toBe("VALIDATION_ERROR");
				expect(err.data).toBeDefined();
				expect(err.data[0].type).toBe("numberMin");
				expect(err.data[0].message).toBe("The 'a' field must be greater than or equal to -100.");
				expect(err.data[0].field).toBe("a");
				expect(err.data[0].actual).toBe(-101);
			}
		});

		it("should return Validation Error (numberMax)", async () => {
			try {
				await broker.call("math.add", {a: 2000, b: 2001});
			} catch (err) {
				expect(err).toBeInstanceOf(ValidationError);
				expect(err.type).toBe("VALIDATION_ERROR");
				expect(err.data).toBeDefined();
				expect(err.data[0].type).toBe("numberMax");
				expect(err.data[0].message).toBe("The 'a' field must be less than or equal to 1000.");
				expect(err.data[0].field).toBe("a");
				expect(err.data[0].actual).toBe(2000);
				expect(err.data[1].type).toBe("numberMax");
				expect(err.data[1].message).toBe("The 'b' field must be less than or equal to 1000.");
				expect(err.data[1].field).toBe("b");
				expect(err.data[1].actual).toBe(2001);
			}
		});
	});

	describe("Test 'math.multiply' action", () => {

		it("should return Integer '9'", async () => {
			const res = await broker.call("math.multiply", { a: 3, b: 3 });
			expect(res).toBe(9);
		});

		it("should return Float '14.4'", async () => {
			const res = await broker.call("math.multiply", { a: 7.2, b: 2 });
			expect(res).toBe(14.4);
		});

		it("should return Validation Error (type)", async () => {
			try {
				await broker.call("math.multiply", {a: "7.4", b: 2});
			} catch (err) {
				expect(err).toBeInstanceOf(ValidationError);
				expect(err.type).toBe("VALIDATION_ERROR");
				expect(err.data).toBeDefined();
				expect(err.data[0].type).toBe("number");
				expect(err.data[0].message).toBe("The 'a' field must be a number.");
				expect(err.data[0].field).toBe("a");
				expect(err.data[0].actual).toBe("7.4");
			}
		});

		it("should return Validation Error (numberMin)", async () => {
			try {
				await broker.call("math.multiply", {a: -101, b: 2});
			} catch (err) {
				expect(err).toBeInstanceOf(ValidationError);
				expect(err.type).toBe("VALIDATION_ERROR");
				expect(err.data).toBeDefined();
				expect(err.data[0].type).toBe("numberMin");
				expect(err.data[0].message).toBe("The 'a' field must be greater than or equal to -100.");
				expect(err.data[0].field).toBe("a");
				expect(err.data[0].actual).toBe(-101);
			}
		});

		it("should return Validation Error (numberMax)", async () => {
			try {
				await broker.call("math.multiply", {a: 2000, b: 2001});
			} catch (err) {
				expect(err).toBeInstanceOf(ValidationError);
				expect(err.type).toBe("VALIDATION_ERROR");
				expect(err.data).toBeDefined();
				expect(err.data[0].type).toBe("numberMax");
				expect(err.data[0].message).toBe("The 'a' field must be less than or equal to 1000.");
				expect(err.data[0].field).toBe("a");
				expect(err.data[0].actual).toBe(2000);
				expect(err.data[1].type).toBe("numberMax");
				expect(err.data[1].message).toBe("The 'b' field must be less than or equal to 1000.");
				expect(err.data[1].field).toBe("b");
				expect(err.data[1].actual).toBe(2001);
			}
		});

		it("should return Overflow Error", async () => {
			try {
				await broker.call("math.multiply", {a: 999, b: 99});
			} catch (err) {
				expect(err).toBeInstanceOf(OverflowError);
				expect(err.type).toBe(OverflowError.TYPE);
				expect(err.data).toBeDefined();
				expect(err.data.requestID).toBeDefined();
				expect(err.data.res).toBe(98901);
			}
		});
	});
});

