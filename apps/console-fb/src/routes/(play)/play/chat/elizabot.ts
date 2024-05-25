/**
 * Taken from: https://github.com/keithweaver/eliza (MIT license)
 * Modified the following:
 *   - All functions have been rewritten according to our own interpretation
 *   - The variables synonyms, templates, replaceWords, ElizaInitials and default-responses.json are copied
 */

/**
 * Module dependencies.
 */

// import default responses
import * as defaultResponses from './default-responses.json';
const responses: DefaultAnswer = defaultResponses;

export type DefaultAnswer = {
	[id: string]: { weight: number; responses: string[] };
};

// variable registering the latest message that this bot has sent
let latestMessage = ' ';

/**
 * Creates a chatbot with the Eliza functionality.
 */
// export function load(url: string, argv: { elizabot:unknown, elizanick:string, elizaowner:string, channelName: string }, client: Client) {
//     const eliza = argv.elizabot ? new BotClient(url, "elizabot", argv.elizanick, argv.elizaowner, client, argv.channelName) : null;
// }

/**
 * Main function of Eliza. This function creates a response based on the message of the user.
 */
export function answer(newMessage: string) {
	const message = processInput(newMessage);
	let words = message.split(' ');

	words = replaceSynonyms(words);
	words = checkTemplates(words);

	const responsesList = [];

	for (let i = 0; i < words.length; i += 1) {
		const keyWord = words[i];
		const keyWord2 = keyWord + ' ' + words[i + 1];
		const keyWord3 = keyWord2 + ' ' + words[i + 2];

		if (keyWord in responses) {
			responsesList.push(responses[keyWord]);
		}
		if (keyWord2 in responses) {
			responsesList.push(responses[keyWord2]);
		}
		if (keyWord3 in responses) {
			responsesList.push(responses[keyWord3]);
		}
	}

	let response = chooseResponse(responsesList);

	if (response.includes('*')) {
		response = fillInAsterisk(response, words);
	}

	return response;
}

/*
 * Process the given string by putting all characters to lower case and removes all punctuation.
 */
function processInput(message: string): string {
	message = message.toLowerCase();
	message = removePunctuation(message);
	return message;
}

/*
 * Removes all the punctuation in the given message.
 */
function removePunctuation(message: string): string {
	// return message.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()]/g, '');
	return message.replace(/[.,/#!?$%^&*;:{}=\-_`~()]/g, '');
}

/**
 * Checks the given array of words for known templates and changes these to a known value in the responses dictionary.
 */
function checkTemplates(words: string[]): string[] {
	for (const template in templates) {
		const list = template.split(' ');
		let index1 = 0;
		while (index1 < words.length) {
			const rememberIndex1 = index1;
			let index2 = 0;
			let check = true;
			while (check) {
				if (index2 == list.length) {
					debug('Matching template found by ELiza');
					check = false;
					const newWords = templates[template];
					const newWordsSplit = newWords.split(' ');
					for (let i = 0; i < newWordsSplit.length; i += 1) {
						words[rememberIndex1 + i] = newWordsSplit[i];
					}
					words.splice(rememberIndex1 + newWordsSplit.length, index1 - rememberIndex1 + newWordsSplit.length);
				} else if (index1 > words.length) {
					check = false;
				} else if (words[index1] == list[index2]) {
					check = true;
					index1 += 1;
					index2 += 1;
				} else if (list[index2].includes('*')) {
					check = true;
					index1 += 1;
					index2 += 1;
				} else {
					check = false;
				}
			}
			index1 = rememberIndex1 + 1;
		}
	}
	return words;
}

/**
 * Replaces the words in the given list by their synonyms (if they exist).
 */
function replaceSynonyms(list: string[]): string[] {
	for (let i = 0; i < list.length; i += 1) {
		const word = list[i];
		if (word in synonyms) {
			list[i] = synonyms[word];
		}
	}

	return list;
}

export function getTimeOut(): boolean {
	return true;
}

/**
 * Chooses a response that the bot will send out of the given list (based on weight of keywords).
 */
function chooseResponse(list: { weight: number; responses: string[] }[]): string {
	if (list.length == 0) {
		const possibleAnswers = responses['RANDOM'].responses;
		return possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
	} else {
		let highest = list[0].weight;

		for (let i = 0; i < list.length; i += 1) {
			if (list[i].weight > highest) {
				highest = list[i].weight;
			}
		}

		let i = 0;

		while (i < list.length) {
			if (list[i].weight < highest) {
				list.splice(i, 1);
			} else {
				++i;
			}
		}

		const answers = list[Math.floor(Math.random() * list.length)].responses;
		let chosenAnswer = answers[Math.floor(Math.random() * answers.length)];

		while (chosenAnswer == latestMessage && answers.length > 1) {
			chosenAnswer = answers[Math.floor(Math.random() * answers.length)];
		}

		latestMessage = chosenAnswer;
		return chosenAnswer;
	}
}

/**
 * Fills in the asterisk of a response. The input from the user is repeated. Some words are replaced
 * by others (see replaceWords).
 */
function fillInAsterisk(response: string, words: string[]): string {
	let key = '';
	for (const x in responses) {
		if (responses[x].responses.includes(response)) {
			key = x;
		}
	}

	let index = 0;
	for (let y = 0; y < words.length; y += 1) {
		if (words[y] == key) {
			index = y + 1;
		} else if (words[y] + ' ' + words[y + 1] == key) {
			index = y + 2;
		} else if (words[y] + ' ' + words[y + 1] + ' ' + words[y + 2] == key) {
			index = y + 3;
		}
	}

	let response3 = '';
	for (let z = index; z < words.length; z += 1) {
		response3 = response3.concat(' ');
		if (replaceWords[words[z]] != undefined) {
			response3 = response3.concat(replaceWords[words[z]]);
		} else {
			response3 = response3.concat(words[z]);
		}
	}

	const responseList = response.split(' ');
	let asteriskFound = false;
	let w = 0;
	while (!asteriskFound) {
		if (responseList[w] == '*') {
			asteriskFound = true;
		} else {
			w += 1;
		}
	}

	const list2 = responseList.slice(0, w);
	const list4 = responseList.slice(w + 1, responseList.length);
	const response2 = myListToString(list2);
	const response4 = myListToString(list4);

	return response2 + response3 + response4;
}

/**
 * Transforms the given list of words to a string. An empty space is placed between the words.
 */
function myListToString(list: string[]): string {
	let string = '';
	for (let x = 0; x < list.length; x += 1) {
		if (list[x] != '?' && x != 0) {
			string = string.concat(' ');
		}
		string = string.concat(list[x]);
	}
	return string;
}

/**
 * Returns a message that the bot will say when it doesn't receive a message during some time period.
 */
export function timeoutmessage(): string {
	return elizaInitials[Math.floor(Math.random() * elizaInitials.length)];
}

/*
 * Dictionary of synonyms. This limits the number of entries in the dictionary 'responses'.
 *
 * Taken from: https://github.com/keithweaver/eliza (MIT license) and modified.
 */
const synonyms: { [id: string]: string } = {
	apologise: 'sorry',
	deutsch: 'another language',
	francais: 'another language',
	french: 'another language',
	italiano: 'another language',
	italian: 'another language',
	espanol: 'another language',
	spanish: 'another language',
	xforeign: 'another language',
	dream: 'dreamed',
	dreams: 'dreamed',
	'am i': 'i am',
	im: 'i am',
	"i'm": 'i am',
	"you're": 'you',
	'you are': 'you',
	'i was': 'was i',
	computers: 'computer'
};

/**
 * Dictionary with templates. "I am *1-3* happy" means that there can be one to three words on that position.
 * For example: "i am extremely happy" becomes "i am happy" (The second string is a key in the responses dictionary.)
 *
 * Taken from: https://github.com/keithweaver/eliza (MIT license) and modified.
 */
const templates: { [id: string]: string } = {
	'i am *1-3* happy': 'i am happy',
	'i am *1-3* sad': 'i am sad',
	'i am *1-3* bored': 'i am bored'
};

/**
 * Dictionary with words that the bot replaces when she uses the words of an incoming message.
 *
 * Taken from: https://github.com/keithweaver/eliza (MIT license) and modified.
 */
const replaceWords: { [id: string]: string } = {
	i: 'you',
	you: 'i',
	me: 'you',
	my: 'your',
	am: 'are',
	are: 'am',
	was: 'were',
	"i'd": 'you would',
	"i've": 'you have',
	"i'll": 'you will',
	"you've": 'i have',
	"you'll": 'i will',
	your: 'my',
	yours: 'mine',
	'always had': 'always have'
};

/**
 * Dictionary with sentences to initiate a conversation.
 *
 * Taken from: https://github.com/keithweaver/eliza (MIT license) and modified.
 */
const elizaInitials: string[] = [
	'How do you do.  Please tell me your problem.',
	"Please tell me what's been bothering you.",
	'Is something troubling you ?',
	'Im here. Talk to me.',
	'Talk to me',
	'Top of the morning to you.',
	'Thanks for waking me up'
];
