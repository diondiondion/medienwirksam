import styled from 'styled-components'

import {getRgb} from '@utils/hexToRgb'

const ClearButton = styled.button`
	display: inline-block;
	flex: none;
	border: none;
	padding: 0.5rem;

	color: inherit;
	background-color: transparent;

	-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none;

	${p =>
		p.dimmed &&
		`
			opacity: 0.5;
	`}
	cursor: pointer;

	transition: all 0.15s ease;

	&:hover {
		background-color: rgba(${p => getRgb(p.theme.background)}, 0.1);
		opacity: 1;
	}

	&:focus {
		color: ${p => p.theme.background};
		background-color: ${p => p.theme.text};
		opacity: 1;
	}

	& svg {
		width: auto;
		height: auto;
	}
`

ClearButton.defaultProps = {
	type: 'button',
}

export default ClearButton
