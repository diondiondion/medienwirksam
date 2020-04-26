import React, {forwardRef} from 'react'

import Svg from './Svg'

function WaveformIcon({size, ...otherProps}, ref) {
	return (
		<Svg ref={ref} size={size} {...otherProps} viewBox="0 0 30 30">
			<path
				d="M-6576,331V307h3v24Zm-8-3V310h3v18Zm12-1V311h3v16Zm-8-4v-8h3v8Zm12-2v-4h3v4Z"
				transform="translate(6590 -304)"
			/>
		</Svg>
	)
}

export default forwardRef(WaveformIcon)
