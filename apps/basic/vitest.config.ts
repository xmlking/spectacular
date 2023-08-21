import { defaultExclude, defineProject, mergeConfig } from 'vitest/config';
import configShared from '../../vitest.config';

export default mergeConfig(
	configShared,
	defineProject({
		test: {
			exclude: [
				...defaultExclude, //
				'**/tests/mocks/**'
			]
		}
	})
);
