import React, {forwardRef} from 'react'

import Svg from './Svg'

function PauseIcon({size, ...otherProps}, ref) {
	return (
		<Svg ref={ref} size={size || 45} {...otherProps} viewBox="0 0 30 30">
			<path
				d="M-7348-1950h-6v-16h6v16Zm-10,0h-6v-16h6v16Z"
				transform="translate(7371 1973)"
			/>
		</Svg>
	)
}

export default forwardRef(PauseIcon)
