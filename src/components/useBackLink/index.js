import React, {createContext, memo, useContext, useEffect, useRef} from 'react'

const BackLinkContext = createContext('/')

function Provider({children, pathname}) {
	const previousPathname = useRef(pathname)
	const hasHistory = useRef(false)

	useEffect(() => {
		if (pathname !== previousPathname.current) {
			hasHistory.current = true
			previousPathname.current = pathname
		}
	}, [pathname])

	return (
		<BackLinkContext.Provider
			value={hasHistory.current ? previousPathname.current : '/'}
		>
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
