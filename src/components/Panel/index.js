import styled from 'styled-components'

const Panel = styled.div`
	margin: 0;
	padding: ${p => p.theme.spacing[p.spacing] || 0};

	color: ${p => p.theme.text};
	background-color: ${p => p.theme.panel};

	font-size: ${p =>
		p.fontSize ? p.theme.typeScale[p.fontSize] || p.fontSize : 'inherit'};

	box-shadow: 0 0 30px #ffffff2b;
`

export default Panel
