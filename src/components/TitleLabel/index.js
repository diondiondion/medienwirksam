import React from 'react'
import styled from 'styled-components'
import invert from 'invert-color'

import theme from '@style/theme'
import {fontSmoothing} from '@style/mixins'

const Wrapper = styled.h2`
	display: block;
	max-width: 100%;
	margin: 0;
	margin-bottom: 0.5rem;

	font-family: ${theme.fonts.label};
	font-size: 1.4rem;
	text-transform: uppercase;

	transform: rotate(-3deg);
	${fontSmoothing}
`

const InnerText = styled.span`
	padding: 0.05em 0.4em;
	box-decoration-break: clone;
	-webkit-box-decoration-break: clone;

	color: ${p => invert(p.color, true) || '#000'};
	background-color: ${p => p.color || '#ffe627'};
`

function TitleLabel({children, color, ...otherProps}) {
	return (
		<Wrapper {...otherProps}>
			<InnerText color={color}>{children}</InnerText>
		</Wrapper>
	)
}

export default TitleLabel
