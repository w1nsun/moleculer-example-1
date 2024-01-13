"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
	name: "logger",

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

		log: {
			rest: {
				method: "POST",
				path: "/log"
			},
			params: {
				operation: { type: "string", optional: true },
				operationRes: { type: "string", optional: true },
				operationReqId: { type: "string", optional: true }
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				const { operation, operationRes, operationReqId } = ctx.params;
				this.logger.info("Action completed", { operation, operationRes, operationReqId });
			}
		},
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
