import React from 'react'
import styled from 'styled-components'
import {Link} from 'gatsby'

import TitleLabel from '@components/TitleLabel'

const Wrapper = styled.article`
	display: grid;
	max-width: 600px;
`

const Figure = styled.figure`
	max-width: 300px;
`

const Info = styled.div``

function PlaylistItem({playlist, link, imageCdnRoot}) {
	const {
		frontmatter: {title, artist, tracks, frontCover},
	} = playlist
	const imageUrl = frontCover ? `https://${imageCdnRoot}${frontCover}` : null

	return (
		<Wrapper>
			<TitleLabel>{title}</TitleLabel>
			<Figure>{imageUrl && <img src={imageUrl} alt="" />}</Figure>
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
