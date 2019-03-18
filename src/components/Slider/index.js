import React from 'react'
import styled, {css} from 'styled-components'

import ThemeSection from '@components/ThemeSection'

import {getRgb} from '@utils/hexToRgb'

const trackStyle = css`
	background-color: rgba(${p => getRgb(p.theme.highlight.color)}, 0.25);
	height: 7px;
`

const thumbStyle = css`
	box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.25);
	border: 1px solid rgba(0, 0, 0, 0.33);
	height: 42px;
	width: 20px;
	border-radius: 0;
	background-color: ${p => p.theme.highlight.background};
	background-image: linear-gradient(to left, currentColor, currentColor);
	background-size: 2px 20px;
	background-repeat: no-repeat;
	background-position: center;
	cursor: pointer;
`

const Input = styled.input.attrs({type: 'range'})`
	-webkit-appearance: none;
	appearance: none;
	color: inherit;
	background: transparent;

	::-webkit-slider-runnable-track {
		${trackStyle}
		-webkit-appearance: none;
	}
	::-webkit-slider-thumb {
		${thumbStyle}
		-webkit-appearance: none;
		margin-top: -19px;
	}

	::-moz-range-track {
		${trackStyle}
	}
	::-moz-range-thumb {
		${thumbStyle}
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
}

export default Slider
