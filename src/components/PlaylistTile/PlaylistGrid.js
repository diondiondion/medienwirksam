import styled from 'styled-components'

const PlaylistGrid = styled.section`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min-content, 540px));
	grid-gap: ${p => p.theme.spacing.xl};
	justify-content: center;
`

export default PlaylistGrid
