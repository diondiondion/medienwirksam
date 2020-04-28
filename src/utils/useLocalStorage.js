import {useStorageReducer, useStorageState} from 'react-storage-hooks'

function hasLocalStorage() {
	try {
		if (typeof localStorage === 'undefined') {
			return false
		}
	} catch (err) {
		return false
	}

	return true
}

const dummyStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {},
}

function useLocalStorageReducer(...args) {
	return useStorageReducer(
		hasLocalStorage() ? localStorage : dummyStorage,
		...args
	)
}

function useLocalStorageState(...args) {
	return useStorageState(
		hasLocalStorage() ? localStorage : dummyStorage,
		...args
	)
}

export {useLocalStorageReducer, useLocalStorageState}
