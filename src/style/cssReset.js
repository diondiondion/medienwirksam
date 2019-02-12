import {css} from 'styled-components'

const cssReset = css`
	html {
		box-sizing: border-box;
	}
	*,
	*:after,
	*:before {
		box-sizing: inherit;
	}
	html,
	body {
		margin: 0;
		padding: 0;
	}
	article,
	aside,
	figcaption,
	figure,
	footer,
	header,
	menu,
	main,
	nav,
	section {
		display: block;
	}
	img,
	svg {
		display: inline-block;
		vertical-align: middle;
		border: none;
	}
	svg {
		fill: currentColor;
		width: 1em;
		height: 1em;
	}
	h1,
	h2,
	h3,
	h4,
	h5 {
		font-size: 1em;
		font-weight: normal;
	}
	input,
	textarea,
	select {
		margin: 0;
		font: inherit;
		outline: none;
	}
	textarea {
		vertical-align: top;
	}
	input::-moz-focus-inner,
	button::-moz-focus-inner /* Remove button padding in FF */
	 {
		border: 0;
		padding: 0;
	}
`

export default cssReset
