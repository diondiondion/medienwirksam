import React, {forwardRef} from 'react'

import Svg from './Svg'

function PlayIcon({size, ...otherProps}, ref) {
	return (
		<Svg ref={ref} size={size || 45} {...otherProps} viewBox="0 0 30 30">
			<path d="M0,0,18,9,0,18Z" transform="translate(8 6)" />
		</Svg>
	)
}

export default forwardRef(PlayIcon)
