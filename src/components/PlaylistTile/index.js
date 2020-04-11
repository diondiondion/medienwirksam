import React, {useContext} from 'react'
import styled from 'styled-components'
import {Link} from 'gatsby'
import {Flipped} from 'react-flip-toolkit'

import friendlyList from '@utils/friendlyList'
import TitleLabel from '@components/TitleLabel'
import {TrackContext} from '@components/AppWrapper'
import {IsPlayingIcon} from '@components/icons'
import PlaylistGrid from './PlaylistGrid'

const Wrapper = styled.article`
	position: relative;
	display: flex;
	flex-wrap: wrap;
	width: 100%;
`

const ImageContainer = styled.div`
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

const PlayingIndicator = styled(IsPlayingIcon)`
	width: ${p => p.theme.spacing.m};
	height: ${p => p.theme.spacing.m};
	margin-right: ${p => p.theme.spacing.xs};
	vertical-align: -${p => p.theme.spacing.xxs};
`

function PlaylistTile({playlist, link, slug, imageCdnRoot}) {
	const {
		frontmatter: {title, artists, year, tracks, frontCover, color},
	} = playlist
	const imageUrl = frontCover
		? `https://${imageCdnRoot}w_340,h_340,c_fill/${frontCover}`
		: null

	const {playlist: playingPlaylist} = useContext(TrackContext)

	const isPlaying = playingPlaylist && playingPlaylist.title === title

	return (
		<Wrapper>
			<Flipped stagger flipId={`playlistImage-${slug}`}>
				<ImageContainer>
					{imageUrl && <img src={imageUrl} alt="" width="235" height="235" />}
				</ImageContainer>
			</Flipped>
			<Info>
				<Heading>
					<Flipped stagger flipId={`playlistTitle-${slug}`}>
						<TitleLabel color={color}>
							{isPlaying && <PlayingIndicator />}
							{title}
						</TitleLabel>
					</Flipped>
				</Heading>
				<Flipped stagger flipId={`playlistInfo-${slug}`}>
					<Metadata>
						<strong>{friendlyList(artists)}</strong>
						<br />
						<Dimmed>
							{year}
							<br />
							{tracks.length} tracks
							<br />
						</Dimmed>
					</Metadata>
				</Flipped>
				<CoverLink to={link}>Anhören</CoverLink>
			</Info>
		</Wrapper>
	)
}

export {PlaylistGrid}

export default PlaylistTile
