import styled from 'styled-components'

const TextLink = styled.a`
	appearance: none;
	cursor: pointer;

	display: inline-block;
	border: none;
	margin: 0;
	padding: 0;

	color: inherit;
	background-color: transparent;

	font: inherit;
	font-weight: bold;
	font-size: ${p => (p.size ? p.theme.typeScale[p.size] : 'inherit')};
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}

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

export default TextLink
