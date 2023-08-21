/** Generated with https://app.quicktype.io/ **/


export type Role ='Policy.Read' | 'Policy.Write';
/**
 * Normalized User
 * intersection of AzureAD and Google user claims
 */
export interface User {
	sub:  string;
	name:  string;
	email: string;
	 // profile picture url
	picture?: string;
 	roles?: Role[];
}
