import React, {forwardRef} from 'react'

import Svg from './Svg'

function BeatIcon({size, ...otherProps}, ref) {
	return (
		<Svg ref={ref} size={size} {...otherProps} viewBox="0 0 30 30">
			<path
				d="M-6461,325.5c0-1.656,1.792-3,4-3a5.269,5.269,0,0,1,1,.095V311.5l14-4.5v15.5c0,1.657-1.792,3-4,3s-4-1.343-4-3,1.792-3,4-3a5.278,5.278,0,0,1,1,.095v-7.63l-8,2.571V325.5c0,1.657-1.792,3-4,3S-6461,327.157-6461,325.5Z"
				transform="translate(6466 -302.5)"
			/>
		</Svg>
	)
}

export default forwardRef(BeatIcon)
