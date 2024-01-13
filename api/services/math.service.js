"use strict";

const { OPERATIONS_MAP, MULTIPLY_RES_OVERFLOW_LIMIT, OverflowError } = require("../src/infra/math");

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "math",

	hooks: {
		after: {
			"*": "logOperationResult",
		},
		error: {
			"*": "logOperationErrResult",
		},
	},

	/**
	 * Settings
	 */
	settings: {
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		add: {
			rest: {
				method: "POST",
				path: "/add"
			},
			params: {
				a: { type: "number", min: -100, max: 1000 },
				b: { type: "number", min: -100, max: 1000 },
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				return Number(ctx.params.a) + Number(ctx.params.b);
			}
		},

		multiply: {
			rest: {
				method: "POST",
				path: "/multiply"
			},
			params: {
				a: { type: "number", min: -100, max: 1000 },
				b: { type: "number", min: -100, max: 1000 },
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				const { requestID } = ctx;
				const res = Number(ctx.params.a) * Number(ctx.params.b);

				if (res > MULTIPLY_RES_OVERFLOW_LIMIT) {
					throw new OverflowError(undefined, { requestID, res });
				}

				return res;
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		async logOperationResult(ctx, res) {
			const { name: actionName } = ctx.action;
			if (!actionName) {
				this.logger.warn("Unexpected action");
				return res;
			}

			const operation = OPERATIONS_MAP[actionName];
			const operationRes = JSON.stringify(res);
			const { requestID: operationReqId } = ctx;

			// avoid 'await' because we don't need any delay for response to user
			ctx.call("logger.log", { operation, operationRes, operationReqId });

			return res;
		},
		async logOperationErrResult(ctx, err) {
			const { name: actionName } = ctx.action;
			if (!actionName) {
				this.logger.warn("Unexpected action");
				throw err;
			}

			const operation = OPERATIONS_MAP[actionName];
			const operationRes = JSON.stringify(err);
			const { requestID: operationReqId } = ctx;

			// avoid 'await' because we don't need any delay for response to user
			ctx.call("logger.log", { operation, operationRes, operationReqId });

			throw err;
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
