import type { GraphQLError } from 'graphql';

export type Project = {
  id: string;
  name: string;
  image?: string;
  description: string;
  by?: string;
  href?: string;
};

/**
 * SerializableDate used to encode/decode hooks.ts example
 */
export class SerializableDate {
  private readonly dateObj: Date;
  private readonly rawDate: string;

  constructor(isoString: string) {
    this.dateObj = new Date(isoString);
    this.rawDate = isoString;
  }

  public get raw() {
    return this.rawDate;
  }

  public get date() {
    return this.dateObj;
  }
}

/**
 * Policy
 */

export interface Subject {
  id: string;
  displayName: string;
  secondaryId?: string;
}

/**
 * GraphQL API Types
 */

export type PartialGraphQLErrors = readonly Partial<GraphQLError>[] | null;

interface GQLResult<T> {
  data?: T | null;
  errors?: PartialGraphQLErrors;
}

/**
 * Side Nav Links
 */

export enum Roles {
  Anonymous = 'anonymous',
  User = 'user',
  Me = 'me',
  Member = 'org:member',
  Billing = 'org:billing',
  Admin = 'org:admin',
  Owner = 'org:owner',
  SysAdmin = 'sys:admin',
}

export enum OrgRoles {
  Member = 'org:member',
  Billing = 'org:billing',
  Admin = 'org:admin',
}

export type Link = {
  href: string;
  label: string;
  keywords: string;
  badge?: string;
  preload?: string;
  roles?: Roles[];
};

export type List = Array<Link>;
export type MenuNavLinks = Record<string, Array<{ title: string; list: List }>>;

/**
 * Toast flash message
 * Use with `sveltekit-flash-message` and skeleton `Toast`
 */
