import {css} from 'styled-components'

const buttonReset = css`
	appearance: none;
	cursor: pointer;

	display: inline-block;
	border: none;
	margin: 0;
	padding: 0;

	color: inherit;
	background-color: transparent;

	font: inherit;

	&.focus-visible {
		outline: 2px solid currentcolor;
		outline-offset: 4px;
	}

	/* Normalise inner button spacing in Gecko browsers */
	&::-moz-focus-inner {
		padding: 0;
		border: 0;
	}
`

export default buttonReset
