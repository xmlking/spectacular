export type SEOWebSite = {
	name: string;
	baseURL: string;
	language: string;
	title: string;
	description: string;
	favicon?: string;
	logo?: string;
	copyright?: string;
	keywords?: Array<string>;
	contactEmail?: string;
	socials?: Socials;
	creator?: SEOPerson | SEOOrganization;
};

export type Socials = {
	[key: string]: string;
};

export type SEOMenuItem = {
	href: string;
	label: string;
	keywords: string;
	badge?: string;
	external?: boolean;
};

export type Menu = Record<string, Array<{ title: string; list: Array<SEOMenuItem> }>>;

export type SEOWebPage = {
	url: string;
	title: string;
	description?: string;
	author?: string;
	keywords?: Array<string>;
	image?: string;
	imageAlt?: string;
	opengraph?: OpenGraph;
	twitter?: TwitterCard;
};

export type SEOAddress = {
	city?: string;
	state?: string;
	postalCode?: string;
	streetAddress?: string;
};

export type SEOContact = {
	name?: string;
	jobTitle?: string;
	email?: string;
	telephone?: string;
	url?: string;
	address?: SEOAddress | string;
};

export type SEOPerson = SEOContact;

export type SEOOrganization = SEOContact;

/**
 * * OpenGraph
 */
export enum EnumOpenGraphType {
	Website = 'website',
	Article = 'article',
	Book = 'book',
	Business = 'business.business',
	Product = 'product',
	Profile = 'profile',
	MusicSong = 'music.song',
	MusicAlbum = 'music.album',
	MusicPlaylist = 'music.playlist',
	MusicRadioStation = 'music.radio_station',
	VideoMovie = 'video.movie',
	VideoEpisode = 'video.episode',
	VideoTVShow = 'video.tv_show',
	VideoOther = 'video.other'
}

export enum EnumOpenGraphProfileGender {
	Male = 'male',
	Female = 'female'
}

export const OpenGraphType: typeof EnumOpenGraphType = {
	Website: EnumOpenGraphType.Website,
	Article: EnumOpenGraphType.Article,
	Book: EnumOpenGraphType.Book,
	Business: EnumOpenGraphType.Business,
	Product: EnumOpenGraphType.Product,
	Profile: EnumOpenGraphType.Profile,
	MusicSong: EnumOpenGraphType.MusicSong,
	MusicAlbum: EnumOpenGraphType.MusicAlbum,
	MusicPlaylist: EnumOpenGraphType.MusicPlaylist,
	MusicRadioStation: EnumOpenGraphType.MusicRadioStation,
	VideoMovie: EnumOpenGraphType.VideoMovie,
	VideoEpisode: EnumOpenGraphType.VideoEpisode,
	VideoTVShow: EnumOpenGraphType.VideoTVShow,
	VideoOther: EnumOpenGraphType.VideoOther
};

export const OpenGraphProfileGender: typeof EnumOpenGraphProfileGender = {
	Male: EnumOpenGraphProfileGender.Male,
	Female: EnumOpenGraphProfileGender.Female
};

export type OpenGraph = {
	type: string;
	article?: OpenGraphArticle;
	book?: OpenGraphBook;
	business?: OpenGraphBusiness;
	product?: OpenGraphProduct;
	profile?: OpenGraphProfile;
	song?: OpenGraphMusicSong;
	album?: OpenGraphMusicAlbum;
	playlist?: OpenGraphMusicPlaylist;
	radioStation?: OpenGraphMusicRadioStation;
	movie?: OpenGraphVideoMovie;
	episode?: OpenGraphVideoEpisode;
	tvShow?: OpenGraphVideoTVShow;
};

export type OpenGraphArticle = {
	published_at?: Date;
	modified_at?: Date;
	expiration_time?: Date;
	section?: string;
	tags?: Array<string>;
};

export type OpenGraphBook = {
	author: string;
	isbn?: string;
	release_date?: Date;
	tags?: Array<string>;
};

export type OpenGraphBusiness = {
	street_address?: string;
	city?: string;
	state?: string;
	postal_code?: number;
	country?: string;
};

export type OpenGraphProduct = {
	plural_title?: string;
	price?: number;
	currency?: string;
};

export type OpenGraphProfile = {
	url: string;
	first_name?: string;
	last_name?: string;
	username?: string;
	gender?: EnumOpenGraphProfileGender;
};

type OpenGraphMusic = {
	url: string;
	disc?: number;
	track?: number;
};

export type OpenGraphMusicSong = OpenGraphMusic & {
	duration?: number;
	album?: Array<OpenGraphMusicAlbum>;
	musician?: Array<OpenGraphProfile>;
};

export type OpenGraphMusicAlbum = OpenGraphMusic & {
	songs?: Array<OpenGraphMusicSong>;
	musicians?: Array<OpenGraphProfile>;
	release_date?: Date;
};

export type OpenGraphMusicPlaylist = OpenGraphMusic & {
	song?: OpenGraphMusicSong;
	creator?: OpenGraphProfile;
};

export type OpenGraphMusicRadioStation = {
	creator?: OpenGraphProfile;
};

type OpenGraphVideo = {
	actor?: Array<OpenGraphProfile>;
	actorRole?: string;
	director?: Array<OpenGraphProfile>;
	writer?: Array<OpenGraphProfile>;
	duration?: number;
	release_date?: Date;
	tags?: Array<string>;
};

export type OpenGraphVideoMovie = OpenGraphVideo;

export type OpenGraphVideoTVShow = OpenGraphVideo;

export type OpenGraphVideoOther = OpenGraphVideo;

export type OpenGraphVideoEpisode = OpenGraphVideo & {
	series: OpenGraphVideoTVShow;
};

/**
 * * EnumTwitterCardType
 *
 * * Enumation with different TwitterCard types:
 * * https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
 *
 * - SUMMARY: Title, description, and thumbnail
 * - LARGE: Similar to the Summary Card, but with a prominently-featured image
 * - APP: A Card with a direct download to a mobile app
 * - PLAYER: A Card that can display video/audio/media
 */
export enum EnumTwitterCardType {
	Summary = 'summary',
	Large = 'summary_large_image',
	App = 'app',
	Player = 'player'
}

export const TwitterCardType: typeof EnumTwitterCardType = {
	Summary: EnumTwitterCardType.Summary,
	Large: EnumTwitterCardType.Large,
	App: EnumTwitterCardType.App,
	Player: EnumTwitterCardType.Player
};

/**
 * * TwitterCard
 *
 * @param type - The card type: summary | summary_large_image | player | app
 * @param site - (otional) The Twitter @username the card should be attributed to.
 * @param player - (optional) A Card that can display video/audio/media
 * @param app - (optional) A Card with a direct download to a mobile app
 */
export type TwitterCard = {
	type: string;
	site?: string;
	player?: TwitterPlayer;
	app?: TwitterApp;
};

/**
 * * TwitterPlayer
 *
 * * https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/player-card
 * @param url - HTTPS URL to iFrame player
 * @param width - Width of iFrame specified in twitter:player in pixels
 * @param height - Height of iFrame specified in twitter:player in pixels
 */
export type TwitterPlayer = {
	url: string; // HTTPS URL to iFrame player.
	width: string; // Width of iFrame specified in twitter:player in pixels
	height: string; // Height of iFrame specified in twitter:player in pixels
};

/**
 * * ITwitterApp
 *
 * * https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/app-card
 * @param country - (optional)
 * @param idIPhone - String value, the numeric representation of your app ID in the App Store
 * @param idIPad - String value, the numeric representation of your app ID in the App Store
 * @param idGooglePlay - String value, the numeric representation of your app ID in the Google Play
 */
export type TwitterApp = {
	country?: string;
	idIPhone: string;
	idIPad: string;
	idGooglePlay: string;
};
