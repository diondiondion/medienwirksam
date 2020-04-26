import React, {forwardRef} from 'react'

import Svg from './Svg'

function MoreIcon({size, ...otherProps}, ref) {
	return (
		<Svg ref={ref} size={size} {...otherProps} viewBox="0 0 30 30">
			<path
				d="M-7447-1944v-5h5v5Zm0-9v-5h5v5Zm0-9v-5h5v5Z"
				transform="translate(7460 1971)"
			/>
		</Svg>
	)
}

export default forwardRef(MoreIcon)
