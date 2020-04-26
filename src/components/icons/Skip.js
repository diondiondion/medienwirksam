import React, {forwardRef} from 'react'

import Svg from './Svg'

function SkipIcon({size, ...otherProps}, ref) {
	return (
		<Svg ref={ref} size={size} {...otherProps} viewBox="0 0 30 30">
			<path
				d="M-7273-1955v-5.454l-10,5.454v-12l10,5.454V-1967h3v12Z"
				transform="translate(7292 1976)"
			/>
		</Svg>
	)
}

export default forwardRef(SkipIcon)
