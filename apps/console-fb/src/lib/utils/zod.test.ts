import { afterAll, beforeAll } from 'vitest';
import { z } from 'zod';
import { asOptionalField, emptyToNull, stringToMap } from './zod.utils';

describe('Test zod validations', () => {
	beforeAll(async () => {
		console.log('beforeAll...');
	});
	afterAll(async () => {
		console.log('afterAll...');
	});
	it('should correctly handles a valid ISO date-string', () => {
		const validFrom = '2022-12-14T22:07:09+00:00';
		const validFrom2 = '2022-12-14T22:07:10.430805+00:00';
		const validTo = null;

		const schema = z.string().datetime({ offset: true }).nullish();

		expect(schema.parse(validFrom)).toStrictEqual(validFrom);
		expect(schema.parse(validFrom2)).toStrictEqual(validFrom2);
		expect(schema.parse(validTo)).toStrictEqual(validTo);

		const validTo2 = '';
		const emptySchema = z.preprocess(emptyToNull, z.string().datetime({ offset: true }).nullish());
		expect(emptySchema.parse(validTo2)).toStrictEqual(null);

		const validTo3 = '';
		const emptyDTSchema = asOptionalField(z.string().datetime({ offset: true }));
		expect(emptyDTSchema.parse(validTo3)).toStrictEqual(undefined);
	});
	it('should correctly convert stringified JSON object to Map', () => {
		const annotations = `{"key1": "value1", "key2": "value2"}`;
		const annotationsMap = new Map<string, string>([
			['key1', 'value1'],
			['key2', 'value2']
		]);
		expect(stringToMap(annotations)).toStrictEqual(annotationsMap);
		const schema = z.preprocess(stringToMap, z.map(z.string().trim().min(3), z.string().trim().min(3)).nullish());
		expect(schema.parse(annotations)).toStrictEqual(annotationsMap);

		// const annotations2 = `{ sumo: 'demo' }`;
		// expect(stringToMap(annotations2)).toThrowError(); // SyntaxError
		// expect(schema.parse(annotations2)).toThrowError(); //.toThrowError(/Unexpected token/);
	});
});
