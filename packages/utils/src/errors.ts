/**
 * Hasura GraphQL Errors
 */
export function isErrorType(errorType: string) {
  return (error: unknown) =>
    typeof error === 'object' &&
    error &&
    'extensions' in error &&
    typeof error.extensions === 'object' &&
    error.extensions &&
    'errorType' in error.extensions &&
    error.extensions.errorType === errorType;
}

export function hasErrorTypes(errorTypes: string[]) {
  return (error: unknown) =>
    typeof error === 'object' &&
    error &&
    'extensions' in error &&
    typeof error.extensions === 'object' &&
    error.extensions &&
    'errorType' in error.extensions &&
    errorTypes.includes(error.extensions.errorType as string);
}

export function isErrorCode(errorCode: string) {
  return (error: unknown) =>
    typeof error === 'object' &&
    error &&
    'extensions' in error &&
    typeof error.extensions === 'object' &&
    error.extensions &&
    'code' in error.extensions &&
    error.extensions.code === errorCode;
}

export function hasErrorMessage(errorMessage: string) {
  return (error: unknown) =>
    typeof error === 'object' &&
    error &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.includes(errorMessage);
}
