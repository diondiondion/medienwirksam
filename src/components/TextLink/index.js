import styled from 'styled-components'

const TextLink = styled.a`
	appearance: none;
	cursor: pointer;

	display: inline-block;
	border: none;
	margin: 0;
	padding: 0;

	color: ${p => p.theme.text};
	background-color: transparent;

	font: inherit;
	font-weight: bold;
	font-size: ${p => p.theme.typeScale.s};
	text-decoration: none;

	&:hover,
	&.focus-visible {
		text-decoration: underline;
	}

	& > svg {
		margin-right: 0.5rem;
		font-size: 1.8em;
		vertical-align: -0.3em;
	}

	/* Normalise inner button spacing in Gecko browsers */
	&::-moz-focus-inner {
		padding: 0;
		border: 0;
	}
`

export default TextLink
