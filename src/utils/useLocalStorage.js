import {useStorageReducer, useStorageState} from 'react-storage-hooks'

import useHasMounted from '@utils/useHasMounted'

const dummyStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {},
}

function useLocalStorageReducer(...args) {
	const hasMounted = useHasMounted()

	return useStorageReducer(hasMounted ? localStorage : dummyStorage, ...args)
}

function useLocalStorageState(...args) {
	const hasMounted = useHasMounted()

	return useStorageState(hasMounted ? localStorage : dummyStorage, ...args)
}

export {useLocalStorageReducer, useLocalStorageState}
