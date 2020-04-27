import styled from 'styled-components'
import theme from '@style/theme'
import {fontSmoothing} from '@style/mixins'

const Heading = styled.h1`
	margin: 0 0 ${p => p.theme.spacing[p.spacing] || 0};

	font-family: ${theme.fonts.label};
	font-size: ${theme.typeScale.xl};
	line-height: 0.8;
	text-transform: uppercase;
	text-decoration: none;
	${fontSmoothing}

	opacity: 0.9;
`

Heading.defaultProps = {
	spacing: 's',
}

export default Heading
