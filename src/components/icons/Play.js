import React from 'react'

function PlayIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			width="45"
			height="45"
			viewBox="0 0 30 30"
			aria-hidden="true"
		>
			<path d="M0,0,18,9,0,18Z" transform="translate(7 6)" />
		</svg>
	)
}

export default PlayIcon
