// Cookie Names
export const NHOST_SESSION_KEY = 'nhostSession';

// Page Routes
export const ROUTE_HOME = '/';
export const ROUTE_AUTH = '/auth';
export const ROUTE_PROFILE = '/profile';
export const ROUTE_DASHBOARD = '/dashboard';

// API Routes
export const API_AUTH = '/api/auth.json';

// symbols
export const COPYRIGHT_ENTITY = '\u00a9'; // (c)
export const H_ELLIPSIS_ENTITY = '\u2026'; // ...
export const VERTICAL_LINE_ENTITY = '\u007c'; // |

// 3rd Party Website/App URIs
export const URL_DICEBEAR = 'https://avatars.dicebear.com/api/avataaars/';

// global constants
export const TABLE_ROWS_PER_PAGE = 5;
/**
 * The maximum number of retries for API requests.
 * @constant
 */
export const MAX_RETRIES = 3;

/**
 * The timeout duration for API requests, in milliseconds.
 * @constant
 */
export const TIMEOUT = 5000;

/**
 * Doctor Specializations
 */
export const SPECIALIZATIONS = [
  'Anesthesiology',
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Endocrinology',
  'Family Medicine',
  'Gastroenterology',
  'General Surgery',
  'Geriatrics',
  'Hematology',
  'Infectious Disease',
  'Internal Medicine',
  'Nephrology',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Urology',
] as const;
/**
 * Defaults
 */
export const DEFAULT_ORGANIZATION = 'spectacular';
export const GRAPHQL_URL = 'https://local.hasura.local.nhost.run';
