import React from 'react'
import styled, {css} from 'styled-components'

import ThemeSection from '@components/ThemeSection'

import {getRgb} from '@utils/hexToRgb'

const trackStyle = css`
	background: linear-gradient(
			to left,
			${p => {
				const gradientColor = getRgb(p.theme.highlight.color)
				return `
				rgba(${gradientColor}, 0.25),
				rgba(${gradientColor}, 0.25)
			`
			}}
		)
		no-repeat 50% 50%;
	background-size: 100% 6px;
`

const thumbStyle = css`
	height: 42px;
	width: 20px;

	border: 1px solid rgba(0, 0, 0, 0.33);
	border-radius: 0;
	box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.25);

	background-color: ${p => p.theme.highlight.background};
	background-image: linear-gradient(to left, currentColor, currentColor);
	background-size: 2px 20px;
	background-repeat: no-repeat;
	background-position: center;
	cursor: pointer;
`

const Input = styled.input.attrs({type: 'range'})`
	display: block;
	width: 100%;
	height: 42px;

	-webkit-appearance: none;
	appearance: none;

	color: inherit;
	background: transparent;

	:focus {
		outline: 4px solid ${p => p.theme.highlight.color};
		outline-offset: 6px;
	}

	::-webkit-slider-runnable-track {
		${p => p.withTrack && trackStyle}
		-webkit-appearance: none;
	}
	::-webkit-slider-thumb {
		${thumbStyle}
		-webkit-appearance: none;
	}

	::-moz-range-track {
		min-height: 6px;
		background-color: transparent;
		${p => p.withTrack && trackStyle}
	}
	::-moz-range-thumb {
		${thumbStyle}
	}
	::-moz-focus-outer {
		border: none;
	}
`
function Slider({color, ...otherProps}) {
	return (
		<ThemeSection color={color}>
			<Input {...otherProps} />
		</ThemeSection>
	)
}
Slider.defaultProps = {
	color: '#000000',
	withTrack: true,
}

export default Slider
