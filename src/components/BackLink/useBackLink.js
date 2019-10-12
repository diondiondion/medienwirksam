import React, {createContext, memo, useContext, useEffect, useRef} from 'react'

const BackLinkContext = createContext('/')

function Provider({children, pathname}) {
	const hasHistoryRef = useRef(false)

	useEffect(() => {
		// We're using a ref so that we don't trigger a rerender,
		// as the new value should only apply on the next render,
		// i.e. the next time `pathname` has changed
		hasHistoryRef.current = true
	}, [pathname])

	return (
		<BackLinkContext.Provider value={hasHistoryRef.current}>
			{children}
		</BackLinkContext.Provider>
	)
}
const BackLinkProvider = memo(
	Provider,
	(prevProps, nextProps) => prevProps.pathname === nextProps.pathname
)

function useBackLink() {
	return useContext(BackLinkContext)
}

export {BackLinkProvider}
export default useBackLink
