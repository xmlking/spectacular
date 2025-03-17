<script lang="ts">
import { LogoIcon } from '$lib/ui/components/logos';
import { VERSION } from '@sveltejs/kit';
import { Github, Linkedin, Twitter, Youtube } from 'lucide-svelte';

const appVersion = __APP_VERSION__;
const gitTag = __GIT_TAG__;
const gitDate = __GIT_DATE__;

// Base Classes
const cBase = 'bg-surface-50 dark:bg-surface-900 border-t border-surface-500/10 text-xs md:text-base';

// Social Icons
const socialLinks = [
  { title: 'GitHub', href: 'https://github.com/xmlking/spectacular', icon: Github },
  { title: 'X (Twitter)', href: 'https://x.com/xmlking', icon: Twitter },
  {
    title: 'Linkedin',
    href: 'https://www.linkedin.com/in/sumanth-c-bb41a93/',
    icon: Linkedin,
  },
  { title: 'YouTube', href: 'https://www.youtube.com/@SumanthChinthagunta', icon: Youtube },
];
</script>

<footer class="page-footer {cBase}">
  <div class="container mx-auto flex flex-col items-center px-5 py-8 sm:flex-row">
    <a
      href={'#'}
      class="title-font flex items-center justify-center font-medium text-gray-900 dark:text-white md:justify-start"
    >
      <LogoIcon />
      <span class="ml-3 text-xl">Datablocks</span>
    </a>
    <p class="mt-4 text-sm text-gray-500 sm:ml-4 sm:mt-0 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:pl-4"
      >© 2020 Datablocks —
      <a href="https://twitter.com/xmlking" class="ml-1 text-gray-600" rel="external">@sumanth</a>
    </p>
    <p class="mt-4 inline-flex justify-center text-xs text-gray-500 sm:ml-auto sm:mt-0 sm:justify-start">
      Version: {appVersion}, Kit: {VERSION} <br /> Tag: {gitTag} <br /> Date: {gitDate}
    </p>
    <span class="mt-4 inline-flex justify-center sm:ml-auto sm:mt-0 sm:justify-start">
      {#each socialLinks as sl}
        <a class="ml-3 text-gray-500" href={sl.href} target="_blank" rel="noreferrer" title={sl.title}>
          <svelte:component this={sl.icon} />
        </a>
      {/each}
    </span>
  </div>
</footer>
