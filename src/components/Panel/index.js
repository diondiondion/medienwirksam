import styled from 'styled-components'

const Panel = styled.div`
	margin: 0;
	padding: ${p => p.theme.spacing.m};

	color: ${p => p.theme.text};
	background-color: ${p => p.theme.panel};

	box-shadow: 0 0 30px #ffffff2b;
`

export default Panel
