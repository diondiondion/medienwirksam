import styled from 'styled-components'
import theme from '@style/theme'
import {fontSmoothing} from '@style/mixins'

const Heading = styled.h1`
	margin: 0 0 ${theme.spacing.s};

	font-family: ${theme.fonts.label};
	font-size: ${theme.typeScale.xl};
	text-transform: uppercase;
	text-decoration: none;
	${fontSmoothing}

	opacity: 0.9;
`

export default Heading
