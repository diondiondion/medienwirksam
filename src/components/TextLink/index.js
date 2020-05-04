import styled from 'styled-components'

import {buttonReset} from '@style/mixins'

const TextLink = styled.a`
	${buttonReset}

	font-weight: bold;
	font-size: ${p => (p.size ? p.theme.typeScale[p.size] : 'inherit')};
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`

export default TextLink
