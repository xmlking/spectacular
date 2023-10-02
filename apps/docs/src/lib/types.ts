export type Post = {
	title: string;
	slug: string;
	description: string;
	date: string;
	headerImage?: string;
	categories: string[];
	published: boolean;
};
