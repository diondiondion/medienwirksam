import React, {forwardRef} from 'react'

function WaveformIcon(props, ref) {
	return (
		<svg
			{...props}
			ref={ref}
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			width="30"
			height="30"
			viewBox="0 0 30 30"
			aria-hidden="true"
		>
			<path
				d="M-6576,331V307h3v24Zm-8-3V310h3v18Zm12-1V311h3v16Zm-8-4v-8h3v8Zm12-2v-4h3v4Z"
				transform="translate(6590 -304)"
			/>
		</svg>
	)
}

export default forwardRef(WaveformIcon)
