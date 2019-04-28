import React from 'react'
import styled from 'styled-components'
import {Link} from 'gatsby'

import TitleLabel from '@components/TitleLabel'

const Wrapper = styled.article`
	position: relative;
	display: flex;
	flex-wrap: wrap;
`

const Figure = styled.figure`
	flex: 1 0 200px;
`

const Info = styled.div`
	flex: 1 1 50%;
	padding-left: 1.5rem;
`

const Heading = styled.header`
	margin-top: -0.5rem;
	margin-left: -0.5rem;
	margin-bottom: 1rem;

	@media (min-width: 459px) {
		margin-top: 2.5rem;
		margin-left: -2.5rem;
	}
`

const CoverLink = styled(Link)`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	overflow: hidden;
	text-indent: 100%;
`

function PlaylistItem({playlist, link, imageCdnRoot}) {
	const {
		frontmatter: {title, artists, tracks, frontCover, color},
	} = playlist
	const imageUrl = frontCover ? `https://${imageCdnRoot}${frontCover}` : null

	return (
		<Wrapper>
			<Figure>{imageUrl && <img src={imageUrl} alt="" />}</Figure>
			<Info>
				<Heading>
					<TitleLabel color={color}>{title}</TitleLabel>
				</Heading>
				<strong>{artists.join(' und ')}</strong>
				<br />
				{tracks.length} tracks
				<br />
				<CoverLink to={link}>View</CoverLink>
			</Info>
		</Wrapper>
	)
}

export default PlaylistItem
