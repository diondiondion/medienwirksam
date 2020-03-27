import React, {useCallback} from 'react'
import styled from 'styled-components'
import {Flipper, Flipped} from 'react-flip-toolkit'
import invert from 'invert-color'

import friendlyList from '@utils/friendlyList'
import {IsPlayingIcon} from '@components/icons'
import Panel from '@components/Panel'

const Tracklist = styled.ol`
	margin: 0;
	padding: 0;
`

const TracklistItem = styled.li`
	list-style: none;
	counter-increment: track-counter;
`

const Track = styled.a`
	position: relative;
	z-index: 0;
	display: inline-block;
	vertical-align: middle;
	max-width: 100%;
	padding: 5px 0;

	font-size: 18px;
	color: ${p => (p.isPlaying ? invert(p.contrastColor, true) : 'inherit')};
	text-decoration: none;

	${p =>
		p.isPlaying &&
		`
		font-weight: bold;
	`}
`

const TrackTitle = styled.span`
	display: inline-block;
	vertical-align: top;
	max-width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	&:before {
		display: inline-block;
		content: counter(track-counter) ' ';
		width: 3ch;
	}
`

const TrackHighlight = styled.span`
	position: absolute;
	top: 0;
	left: -${p => p.theme.spacing.xl};
	right: -${p => p.theme.spacing.s};
	bottom: 0;
	display: flex;
	align-items: center;
	padding-left: ${p => p.theme.spacing.s};
	z-index: -1;
	background-color: ${p => p.color};
	transform: rotate(${(Math.random() * 3 - 1.5).toFixed(2)}deg);
`

function Playlist({
	tracks,
	color,
	currentTrack,
	shouldExcludeArtist = () => false,
	getMp3Link,
	onPlay,
}) {
	const playTrack = useCallback(
		(e, trackIndex) => {
			e.preventDefault()
			onPlay(trackIndex)
		},
		[onPlay]
	)
	console.log(tracks)

	return (
		<Panel>
			<Flipper flipKey={currentTrack && currentTrack.title}>
				<Tracklist>
					{tracks.map((track, index) => {
						if (!track)
							return (
								<TracklistItem key={index}>
									Track {index + 1} nicht gefunden
								</TracklistItem>
							)

						const mainArtist =
							track.artistsAlias ||
							(track.artists.length === 1 ? track.artists[0] : null)
						const showMainArtist = !shouldExcludeArtist(mainArtist)

						const isPlaying = currentTrack && currentTrack.title === track.title
						return (
							<TracklistItem key={track.title}>
								<Track
									isPlaying={isPlaying}
									href={getMp3Link(track.filename)}
									onClick={e => playTrack(e, index)}
									contrastColor={color}
								>
									<TrackTitle>
										{track.title}{' '}
										<span style={{opacity: 0.6}}>
											{showMainArtist && (
												<>
													{track.artistsAlias || friendlyList(track.artists)}{' '}
												</>
											)}
											{track.artistsFeat && (
												<>ft. {friendlyList(track.artistsFeat)}</>
											)}
										</span>
									</TrackTitle>
									{isPlaying && (
										<Flipped flipId="trackHighlight">
											<TrackHighlight key={track.title} color={color}>
												<IsPlayingIcon />
											</TrackHighlight>
										</Flipped>
									)}
								</Track>
							</TracklistItem>
						)
					})}
				</Tracklist>
			</Flipper>
		</Panel>
	)
}

export default Playlist
