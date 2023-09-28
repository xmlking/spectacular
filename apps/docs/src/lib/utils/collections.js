import forEach from 'lodash-es/forEach.js';
import reduce from 'lodash-es/reduce.js';

/**
 * @param {string} on
 * @param {Array.<Object>} collection
 * @param {Array.<string>} giveBack
 *
 * @returns {Array.<Object>}
 */
export const groupedByOne = (on, collection, giveBack) => {
	const res = [];
	const obj = {};

	forEach(collection, (curr) => {
		const property = curr.meta[on];
		if (property != undefined) {
			if (!(property in obj)) {
				obj[property] = { name: property, items: [] };
				res.push(obj[property]);
			}

			let result = {};
			forEach(giveBack, (value) => {
				result[value] = curr.meta[value];
			});
			obj[property].items.push(result);
		}
	});

	return res;
};

/**
 * @param {string} on
 * @param {Array.<Object>} collection
 * @param {Array.<string>} giveBack
 *
 * @returns {Array.<Object>}
 */
export const groupedByMany = (on, collection, giveBack) => {
	return Object.entries(
		reduce(
			collection,
			(acc, curr) => {
				forEach(curr.meta[on], function (item) {
					let result = {};
					forEach(giveBack, (element) => {
						result[element] = curr.meta[element];
					});
					if (acc[item]) {
						acc[item].push(result);
					} else {
						acc[item] = [result];
					}
				});
				return acc;
			},
			{}
		)
	).map(([name, items]) => ({ name, items }));
};
