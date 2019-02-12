import React from 'react'
import styled from 'styled-components'
import {Link} from 'gatsby'

import TitleLabel from '@components/TitleLabel'

const Wrapper = styled.article`
	display: grid;
	max-width: 600px;
`

const Image = styled.figure``

const Info = styled.div``

function PlaylistItem({playlist, link}) {
	const {
		frontmatter: {title, artist, tracks},
	} = playlist

	return (
		<Wrapper>
			<TitleLabel>{title}</TitleLabel>
			<Image>
				<img src="" alt="" />
			</Image>
			<Info>
				<strong>{artist}</strong>
				<br />
				{tracks.length} tracks
				<br />
				<Link to={link}>View</Link>
			</Info>
		</Wrapper>
	)
}

export default PlaylistItem
