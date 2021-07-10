import React, {useContext} from 'react'
import {graphql} from 'gatsby'
import styled from 'styled-components'

import {getArtistLink} from '@utils/getLink'

import Layout from '@components/Layout'
import Filter from '@components/Filter'
import Heading from '@components/Heading'
import {IsPlayingIcon} from '@components/icons'
import Panel from '@components/Panel'
import Playlist from '@components/Playlist'
import Stack from '@components/Stack'
import PlaylistTile, {PlaylistGrid} from '@components/PlaylistTile'
import {PlaylistContext} from '@components/PlaylistState'

const PlayIcon = styled(IsPlayingIcon)`
	width: 1rem;
	height: 1rem;
	vertical-align: 0;
	margin-left: ${p => p.theme.spacing.xxs};
`

function ArtistPlaylist({currentArtist, title, tracks}) {
	const {
		currentTrack,
		changeTrack,
		playlist: currentPlaylist,
	} = useContext(PlaylistContext)

	const {
		alias: artistAliases,
		fields: {slug},
	} = currentArtist
	const artistPlaylist = {
		slug,
		title: `${title} von ${currentArtist.title}`,
		artist: currentArtist.title,
		color: '#09d0ab',
		tracks: tracks.edges.map(({node}) => node),
		path: getArtistLink(currentArtist),
	}

	function playTrack(index) {
		changeTrack(artistPlaylist, index)
	}

	const isCurrentPlaylist =
		currentPlaylist && currentPlaylist.title === artistPlaylist.title

	const artistNames =
		artistAliases && artistAliases.length
			? [currentArtist.title, ...artistAliases]
			: [currentArtist.title]

	console.log(artistNames)

	return (
		<>
			<Heading as="h2">
				{title}
				{isCurrentPlaylist && <PlayIcon />}
			</Heading>
			<Panel spacing="m" fontSize="s">
				<Playlist
					id={title.replace(' ', '_').toLowerCase()}
					data={artistPlaylist}
					currentTrack={currentTrack}
					shouldExcludeArtist={artist => artistNames.includes(artist)}
					maxTrackCount={5}
					color={artistPlaylist.color}
					onPlay={playTrack}
				/>
			</Panel>
		</>
	)
}

function Artist({data}) {
	const {
		currentArtist,
		allArtists,
		playlists,
		tracks,
		featureTracks,
		producedTracks,
	} = data

	return (
		<Layout pageTitle={currentArtist.title} slug={getArtistLink(currentArtist)}>
			<Filter artists={allArtists.nodes} selectedArtist={currentArtist.title} />
			<PlaylistGrid as="main">
				{!!playlists.edges.length && (
					<div>
						<Heading as="h2">Alben</Heading>
						<PlaylistGrid>
							{playlists.edges.map(({node: playlist}) => (
								<PlaylistTile key={playlist.id} playlist={playlist} />
							))}
						</PlaylistGrid>
					</div>
				)}
				<div>
					<Stack spacing="l">
						{!!tracks.edges.length && (
							<ArtistPlaylist
								title="Tracks"
								tracks={tracks}
								currentArtist={currentArtist}
							/>
						)}
						{!!featureTracks.edges.length && (
							<ArtistPlaylist
								title="Features"
								tracks={featureTracks}
								currentArtist={currentArtist}
							/>
						)}
						{!!producedTracks.edges.length && (
							<ArtistPlaylist
								title="Beats"
								tracks={producedTracks}
								currentArtist={currentArtist}
							/>
						)}
					</Stack>
				</div>
			</PlaylistGrid>
		</Layout>
	)
}

export default Artist

export const query = graphql`
	query ($slug: String!, $artistFilter: [String!]) {
		currentArtist: artistsYaml(fields: {slug: {eq: $slug}}) {
			title
			alias
			fields {
				slug
			}
		}
		allArtists: allArtistsYaml(sort: {fields: title, order: ASC}) {
			nodes {
				title
				isMedienwirksam
				fields {
					slug
				}
			}
		}
		playlists: allMarkdownRemark(
			filter: {frontmatter: {artists: {in: $artistFilter}}}
			sort: {fields: [frontmatter___year], order: DESC}
		) {
			totalCount
			edges {
				node {
					id
					fields {
						slug
					}
					frontmatter {
						title
						artists
						frontCover
						backCover
						color
						year
						tracks {
							title
						}
					}
				}
			}
		}
		tracks: allTracksYaml(
			filter: {artists: {in: $artistFilter}}
			sort: {fields: title, order: ASC}
		) {
			edges {
				node {
					id
					title
					artists
					artistsAlias
					artistsFeat
					filename
					producers
					fields {
						slug
					}
				}
			}
		}
		featureTracks: allTracksYaml(
			filter: {artistsFeat: {in: $artistFilter}}
			sort: {fields: title, order: ASC}
		) {
			edges {
				node {
					id
					title
					artists
					artistsAlias
					artistsFeat
					filename
					producers
					fields {
						slug
					}
				}
			}
		}
		producedTracks: allTracksYaml(
			filter: {producers: {in: $artistFilter}}
			sort: {fields: title, order: ASC}
		) {
			edges {
				node {
					id
					title
					artists
					artistsAlias
					artistsFeat
					filename
					producers
					fields {
						slug
					}
				}
			}
		}
	}
`
