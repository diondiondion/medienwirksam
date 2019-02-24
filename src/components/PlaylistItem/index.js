import React from 'react'
import styled from 'styled-components'
import {Link} from 'gatsby'

import TitleLabel from '@components/TitleLabel'

const Wrapper = styled.article`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: max-content;
	grid-column-gap: 1.5rem;
	max-width: 600px;
`

const Heading = styled.header`
	grid-row: 1;
	grid-column: 2;
	margin-top: 3rem;
	margin-left: -3rem;
	margin-bottom: 0.5rem;
`

const Figure = styled.figure`
	grid-row: 1 / 3;
	grid-column: 1;
`

const Info = styled.div`
	grid-row: 2;
	grid-column: 2;
`

function PlaylistItem({playlist, link, imageCdnRoot}) {
	const {
		frontmatter: {title, artists, tracks, frontCover},
	} = playlist
	const imageUrl = frontCover ? `https://${imageCdnRoot}${frontCover}` : null

	return (
		<Wrapper>
			<Heading>
				<TitleLabel>{title}</TitleLabel>
			</Heading>
			<Figure>{imageUrl && <img src={imageUrl} alt="" />}</Figure>
			<Info>
				<strong>{artists}</strong>
				<br />
				{tracks.length} tracks
				<br />
				<Link to={link}>View</Link>
			</Info>
		</Wrapper>
	)
}

export default PlaylistItem
