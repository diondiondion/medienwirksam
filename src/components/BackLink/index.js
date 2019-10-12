import React from 'react'
import {Link} from 'gatsby'

import useBackLink from './useBackLink'

function BackLink({children, onClick, to, ...otherProps}) {
	const hasHistory = useBackLink()

	function goBack(e) {
		e.preventDefault
		history.back()
		if (onClick) onClick(e)
	}

	if (hasHistory) {
		return (
			<button type="button" onClick={goBack} {...otherProps}>
				{children}
			</button>
		)
	}

	return (
		<Link to={to} onClick={onClick} {...otherProps}>
			{children}
		</Link>
	)
}

export default BackLink
