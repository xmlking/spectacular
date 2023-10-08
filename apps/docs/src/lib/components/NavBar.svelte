<script lang="ts">
	import { page } from '$app/stores';
	// import { twMerge } from 'tailwind-merge';
	// import { faBook, faGamepad, faHippo, faHouse, faLightbulb } from '@fortawesome/free-solid-svg-icons';
	// import Icon from 'svelte-awesome/components/Icon.svelte';
	const links = [
		{ href: '/', text: 'Home', /* icon: faHouse */},
		{ href: '/about', text: 'About', /* icon: faGamepad */},
		{ href: '/blog', text: 'Blog', /* icon: faBook */},
		{ href: '/guides', text: 'Guides', /* icon: faBook */},
		{ href: '/faq', text: 'FAQ', /* icon: faBook */},
		{ href: '/contact', text: 'Contact', /* icon: faHippo */},
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
            <!-- <Icon data={link.icon} class="mr-2" /> -->
            {link.text}
        </a>
	{/each}
</nav>
