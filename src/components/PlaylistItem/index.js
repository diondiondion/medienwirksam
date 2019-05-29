import React from 'react'
import styled from 'styled-components'
import {Link} from 'gatsby'
import {Flipped} from 'react-flip-toolkit'

import TitleLabel from '@components/TitleLabel'

const Wrapper = styled.article`
	position: relative;
	display: flex;
	flex-wrap: wrap;
`

const Figure = styled.figure`
	flex: 1 0 140px;

	@media (min-width: ${p => p.theme.breakpoints.m}) {
		flex-basis: 200px;
	}
`

const Info = styled.div`
	flex: 1 1 50%;
	padding-left: 1.25rem;
`

const Metadata = styled.div`
	display: inline-block;
`

const Heading = styled.header`
	margin-top: 1rem;
	margin-left: -2.5rem;
	margin-bottom: 1rem;

	@media (min-width: ${p => p.theme.breakpoints.m}) {
		margin-top: 2rem;
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

const Dimmed = styled.span`
	font-style: italic;
	opacity: 0.75;
`

function PlaylistItem({playlist, link, slug, imageCdnRoot}) {
	const {
		frontmatter: {title, artists, year, tracks, frontCover, color},
	} = playlist
	const imageUrl = frontCover
		? `https://${imageCdnRoot}w_340,h_340,c_fill/${frontCover}`
		: null

	return (
		<Wrapper>
			<Flipped stagger flipId={`playlistImage-${slug}`}>
				<Figure>{imageUrl && <img src={imageUrl} alt="" />}</Figure>
			</Flipped>
			<Info>
				<Heading>
					<Flipped stagger flipId={`playlistTitle-${slug}`}>
						<TitleLabel color={color}>{title}</TitleLabel>
					</Flipped>
				</Heading>
				<Flipped stagger flipId={`playlistInfo-${slug}`}>
					<Metadata>
						<strong>{artists.join(' und ')}</strong>
						<br />
						<Dimmed>
							{year}
							<br />
							{tracks.length} tracks
							<br />
						</Dimmed>
					</Metadata>
				</Flipped>
				<CoverLink to={link}>View</CoverLink>
			</Info>
		</Wrapper>
	)
}

export default PlaylistItem
