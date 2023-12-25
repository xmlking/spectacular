import { AnyZodObject, ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';

/**
 * Parses the given data using the provided Zod schema.
 * @template T - The type of the Zod schema.
 * @param {T} schema - The Zod schema to use for parsing.
 * @param {unknown} data - The data to parse.
 * @returns {Promise<z.infer<T>>} - A promise that resolves to the parsed data.
 * @throws {fromZodError} - Throws an error if the data fails to parse according to the schema.
 */
export async function zParse<T extends AnyZodObject>(
	schema: T,
	data: unknown
): Promise<z.infer<T>> {
	try {
		return await schema.parseAsync(data);
	} catch (error) {
		throw fromZodError(error as ZodError);
	}
}
