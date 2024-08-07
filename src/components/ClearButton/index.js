import styled from 'styled-components'
import invert from 'invert-color'

import {getRgb} from '@utils/hexToRgb'

const ClearButton = styled.button`
	display: inline-block;
	flex: none;
	border: none;
	padding: 0.5rem;
	${p =>
		p.smallPadding &&
		`
		padding: 0.25rem;
	`}

	color: ${p => (p.color ? invert(p.color, true) : 'inherit')};
	background-color: ${p => (p.color ? p.color : 'transparent')};

	-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none;

	${p =>
		p.dimmed &&
		`
			opacity: 0.5;
	`}

	&:disabled {
		opacity: 0.5;
	}

	&:not(:disabled) {
		cursor: pointer;
	}

	transition: all 0.15s ease;

	&:hover:not(:disabled) {
		background-color: ${p =>
			p.color
				? `rgba(${getRgb(p.color)}, 0.9)`
				: `rgba(${getRgb(p.theme.background)}, 0.1)`};
		opacity: 1;
	}

	&.focus-visible {
		color: ${p => p.theme.background};
		background-color: ${p => p.theme.text};
		opacity: 1;
		outline: none;
	}
`

ClearButton.defaultProps = {
	type: 'button',
}

export default ClearButton
