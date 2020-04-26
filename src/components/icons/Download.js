import React, {forwardRef} from 'react'

import Svg from './Svg'

function DownloadIcon({size, ...otherProps}, ref) {
	return (
		<Svg ref={ref} size={size} {...otherProps} viewBox="0 0 30 30">
			<path
				d="M-6502,326v-3h18v3Zm2-11h5v-8h4v8h5l-7,7Z"
				transform="translate(6508 -302)"
			/>
		</Svg>
	)
}

export default forwardRef(DownloadIcon)
