import React, {forwardRef} from 'react'

import Svg from './Svg'

function MutedIcon({size, ...otherProps}, ref) {
	return (
		<Svg ref={ref} size={size} {...otherProps} viewBox="0 0 30 30">
			<path
				d="M-6156.461-983.34a9.93,9.93,0,0,1-4.37,1.007h0v-3l.006,0a6.984,6.984,0,0,0,2.06-.311l-1.7-1.7q-.182.013-.365.013h0v-.38l-1.949-1.949v7.933l-6.605-6.6h-4.444v-8h4.38l-4.548-4.548,2.121-2.121,19.8,19.8-2.122,2.121Zm3.46-2.783-2.14-2.14a6.944,6.944,0,0,0,1.308-4.07,7.007,7.007,0,0,0-7-7v-3a10.011,10.011,0,0,1,10,10,9.892,9.892,0,0,1-2.167,6.21v0Zm-3.581-3.582-2.282-2.281a2.047,2.047,0,0,0,.031-.347,2,2,0,0,0-2-2v-3a5,5,0,0,1,5,5,4.991,4.991,0,0,1-.747,2.628v0Zm-6.2-6.2-3.516-3.517,3.518-3.516v7.035Z"
				transform="translate(6177.833 1007.333)"
			/>
			<path
				d="M21,21"
				transform="translate(6.5 4.5)"
				stroke="currentColor"
				strokeWidth="3"
			/>
		</Svg>
	)
}

export default forwardRef(MutedIcon)
