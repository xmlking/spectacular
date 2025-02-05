// Navigation Sitemap
// `blockPreload: 'false'` means adding data-sveltekit-preload-data="false" to link.

import type { MenuNavLinks } from './types';
import { Roles } from './types';

export const menuNavLinks: MenuNavLinks = {
  '/bookstore': [
    {
      title: '',
      list: [{ href: '/dashboard', label: 'Dashboard', keywords: 'reports, graph' }],
    },
    {
      title: 'Catalog',
      list: [
        {
          href: '/bookstore/books',
          label: 'Books',
          keywords: 'svelte, sirens, license, release',
          preload: 'false',
          roles: [Roles.Owner, Roles.Admin],
        },
        {
          href: '/bookstore/reviews',
          label: 'Review',
          keywords: 'start, install, cli, tailwind, themes, stylesheets',
          roles: [Roles.Owner, Roles.Admin],
        },
      ],
    },
  ],
  '/flows': [
    {
      title: 'Visualization',
      list: [
        {
          href: '/flows/network',
          label: 'Network',
          keywords: 'body, scroll, scrollbar, hr, horizontal, rule, divider',
          roles: [Roles.Owner, Roles.Admin],
        },
        {
          href: '/flows/segments',
          label: 'Segments',
          keywords: 'body, scroll, scrollbar, hr, horizontal, rule, divider',
          roles: [Roles.Owner, Roles.Admin],
        },
      ],
    },
  ],
  '/reports': [
    {
      title: 'Reports',
      list: [
        {
          href: '/reports/access',
          label: 'Access Reports',
          keywords: 'copy, contenteditable, html, input',
          roles: [Roles.Owner, Roles.Admin],
        },
        {
          href: '/reports/usage',
          label: 'Usage Reports',
          keywords: 'usage, metrics',
          roles: [Roles.Owner, Roles.Admin, Roles.SysAdmin],
        },
      ],
    },
  ],
  '/account': [
    {
      title: 'Account',
      list: [
        { href: '/user/profile', label: 'Profile', keywords: 'settings, profile, account' },
        { href: '/user/settings', label: 'Settings', keywords: 'settings, ai, feature-flags, account', badge: '✨' },
        { href: '/user/notifications', label: 'Notifications', keywords: 'notifications, user' },
        { href: '/user/create-organization', label: '＋ Add Organization', keywords: 'add, organization' },
      ],
    },
    {
      title: 'Organization',
      list: [
        {
          href: '/org/update-organization',
          label: 'Organization',
          keywords: 'organization',
          roles: [Roles.Owner, Roles.Admin],
        },
        {
          href: '/org/settings',
          label: 'Settings',
          keywords: 'settings, configuration, environment-variables, organization',
          roles: [Roles.Owner, Roles.Admin],
        },
        {
          href: '/org/notifications',
          label: 'Notifications',
          keywords: 'notifications, organization',
          roles: [Roles.Owner, Roles.Admin],
        },
        {
          href: '/org/members',
          label: 'Members',
          keywords: 'account, user, member, organization',
          roles: [Roles.Owner, Roles.Admin],
        },
        {
          href: '/org/groups',
          label: 'Groups',
          keywords: 'account, group, organization',
          roles: [Roles.Owner, Roles.Admin],
        },
        {
          href: '/org/billing',
          label: 'Billing',
          keywords: 'billing, plan, organization',
          roles: [Roles.Owner, Roles.Billing],
        },
        {
          href: '/org/invoices',
          label: 'Invoices',
          keywords: 'billing, invoices, organization',
          roles: [Roles.Owner, Roles.Billing],
        },
      ],
    },
    {
      title: 'Admin',
      list: [
        {
          href: '/admin/organizations',
          label: 'Organizations',
          keywords: 'organization, admin, system',
          roles: [Roles.SysAdmin],
        },
        {
          href: '/admin/users',
          label: 'Users',
          keywords: 'users, admin, system',
          roles: [Roles.SysAdmin],
        },
        {
          href: '/org/notifications',
          label: 'Notifications',
          keywords: 'notifications, admin, system',
          roles: [Roles.SysAdmin],
        },
      ],
    },
  ],
  '/ai': [
    {
      title: 'AI',
      list: [
        { href: '/ai/writing', label: 'Smart Writing', keywords: 'Smart Components, ai, writing' },
        { href: '/ai/pastesmart', label: 'Smart Paste', keywords: 'Smart Paste, ai, smart-forms' },
        { href: '/ai/smart', label: 'Smart Components', keywords: 'Smart Components, ai, completion' },
        { href: '/ai/chat', label: 'Chat', keywords: 'chat, OpenAI' },
        { href: '/ai/rag', label: 'RAG Apps', keywords: 'RAG, ai, completion' },
      ],
    },
  ],
};

// Build Inverted Index for fast lookup
type InvertedIndex = Record<string, string>;

const buildInvertedIndex = (menu: MenuNavLinks): InvertedIndex => {
  const invertedIndex: InvertedIndex = {};
  for (const topLevelKey of Object.keys(menu)) {
    const sections = menu[topLevelKey];
    for (const section of sections) {
      for (const item of section.list) {
        const key = item.href.split('/')[1];
        invertedIndex[key] = topLevelKey;
      }
    }
  }
  return invertedIndex;
};
export const hrefToCategoryIndex = buildInvertedIndex(menuNavLinks);
