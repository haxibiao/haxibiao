/*
 * @flow
 * created by wyk made in 2019-06-21 17:39:19
 */
import AsyncStorage from '@react-native-community/async-storage';

interface ItemKeys {
	me: string;
	taskGuide: string;
	resetVersion: string;
	firstInstall: string;
	viewedVersion: any;
	createPostGuidance: string;
	createUserAgreement: string;
	ShowSplash: string;
}

const Keys: ItemKeys = {
	me: 'me',
	taskGuide: 'taskGuide',
	resetVersion: 'resetVersion',
	firstInstall: 'firstInstall',
	viewedVersion: 'viewedVersion',
	createPostGuidance: 'createPostGuidance',
	createUserAgreement: 'createUserAgreement',
	ShowSplash: 'ShowSplash',
};

async function removeItem(key: keyof ItemKeys) {
	try {
		await AsyncStorage.removeItem(key);
		console.log(`It was removed ${key} successfully`);
		return true;
	} catch (error) {
		console.log(`It was removed ${key} failure`);
	}
}

async function setItem(key: keyof ItemKeys, value: any) {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(value));
		console.log(`It was saved ${key} successfully`);
		return value;
	} catch (error) {
		console.log(`It was saved ${key} failure`);
	}
}

async function getItem(key: keyof ItemKeys) {
	let results: any;
	try {
		results = await AsyncStorage.getItem(key);
		return JSON.parse(results);
	} catch (error) {
		return null;
	}
}

async function clearAll() {
	return AsyncStorage.clear();
}

export { Keys };

export const Storage = {
	removeItem,
	getItem,
	setItem,
	clearAll,
};
