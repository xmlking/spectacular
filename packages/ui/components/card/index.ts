import Root from './card.svelte';
import Content from './card-content.svelte';
import Description from './card-description.svelte';
import Footer from './card-footer.svelte';
import Header from './card-header.svelte';
import Title from './card-title.svelte';

export const Card = { Root, Content, Description, Footer, Header, Title };
export {
	Root as CardRoot,
	Content as CardContent,
	Description as CardDescription,
	Footer as CardFooter,
	Header as CardHeader,
	Title as CardTitle
};

export type CardHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
