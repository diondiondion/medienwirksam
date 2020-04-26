import React, {forwardRef} from 'react'

import Svg from './Svg'

function BackIcon({size, ...otherProps}, ref) {
	return (
		<Svg ref={ref} size={size} {...otherProps} viewBox="0 0 30 30">
			<path
				d="M-6173.251-992.63l17.035-9.939v7.4h7.45l-.765,6h-6.685v6.479Z"
				transform="translate(6175.766 1008.172)"
			/>
		</Svg>
	)
}

export default forwardRef(BackIcon)
