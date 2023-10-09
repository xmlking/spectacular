<script lang="ts">
	import { Icon, HouseSolid, FutbolRegular, BullhornSolid, BookSolid, CircleQuestionRegular, CommentRegular } from 'svelte-awesome-icons';
	import { page } from '$app/stores';
	// import { twMerge } from 'tailwind-merge';
	const links = [
		{ href: '/', text: 'Home',  icon: HouseSolid },
		{ href: '/about', text: 'About', icon: FutbolRegular},
		{ href: '/blog', text: 'Blog', icon: BullhornSolid},
		{ href: '/guides', text: 'Guides', icon: BookSolid},
		{ href: '/faq', text: 'FAQ', icon: CircleQuestionRegular},
		{ href: '/contact', text: 'Contact', icon: CommentRegular},
	];

	$: classesActive = (href: string) => {
        if (href !== '/') {
            return ($page.url.pathname.includes(href) ? 'variant-ghost-primary' : '');
        } else {
            return ($page.url.pathname === href ? 'variant-ghost-primary' : '');
        }
    }

</script>

<nav class="lex-row list-nav justify-center hidden lg:flex">
	{#each links as link}
		<a href={link.href} class={classesActive(link.href)}>
			<Icon class="mr-2" icon={link.icon} size={16} />
            {link.text}
        </a>
	{/each}
</nav>
