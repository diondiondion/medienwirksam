import React, {useState, useCallback, useRef, useEffect} from 'react'
import styled from 'styled-components'
import {Flipper, Flipped} from 'react-flip-toolkit'
import invert from 'invert-color'

import friendlyList from '@utils/friendlyList'
import {IsPlayingIcon} from '@components/icons'
import Panel from '@components/Panel'
import TextLink from '@components/TextLink'

const Tracklist = styled.ol.attrs({
	role: 'list',
})`
	margin: 0;
	padding: 0;
`

const TracklistItem = styled.li.attrs({
	role: 'listitem',
})`
	${p =>
		p.isHidden &&
		`
		display: none;
	`}

	list-style: none;
	counter-increment: track-counter;
`

const ExpandListLink = styled(TextLink)`
	padding: 0.5rem 1.5rem;
	margin-bottom: -0.5rem;
	width: 100%;
	text-align: left;
`

const Track = styled.a`
	position: relative;
	z-index: 0;
	display: inline-block;
	vertical-align: middle;
	max-width: 100%;
	padding: ${p => p.theme.spacing.xs} 0;

	font-size: 0.9rem;
	color: ${p => (p.isPlaying ? invert(p.contrastColor, true) : 'inherit')};
	text-decoration: none;

	&.focus-visible {
		outline: 2px solid currentcolor;
		outline-offset: 4px;
	}

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
	id,
	tracks,
	maxTrackCount = Infinity,
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

	const firstExpandedTrackRef = useRef()
	const toggleButtonRef = useRef()
	const shouldHandleFocus = useRef(false)
	const isExpandable = tracks.length > maxTrackCount
	const [showAll, setShowAll] = useState(!isExpandable)
	function toggleShowAll() {
		setShowAll(prevShowAll => !prevShowAll)
		shouldHandleFocus.current = true
	}

	useEffect(() => {
		if (shouldHandleFocus.current) {
			if (showAll) {
				firstExpandedTrackRef.current?.focus()
			} else {
				toggleButtonRef.current?.focus()
			}
			shouldHandleFocus.current = false
		}
	}, [showAll])

	const listId = id

	return (
		<Panel>
			<Flipper flipKey={currentTrack && currentTrack.title}>
				<Tracklist id={listId}>
					{tracks.map((track, index) => {
						if (!track)
							return (
								<TracklistItem key={index}>
									Track {index + 1} nicht gefunden
								</TracklistItem>
							)

						const shouldTrackBeHidden = !showAll && index + 1 > maxTrackCount
						const shouldTrackBeFocusedAfterExpanding = index === maxTrackCount

						const mainArtist =
							track.artistsAlias ||
							(track.artists.length === 1 ? track.artists[0] : null)
						const showMainArtist = !shouldExcludeArtist(mainArtist)

						const isPlaying = currentTrack && currentTrack.title === track.title
						return (
							<TracklistItem key={track.title} isHidden={shouldTrackBeHidden}>
								<Track
									ref={
										shouldTrackBeFocusedAfterExpanding
											? firstExpandedTrackRef
											: undefined
									}
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
			{isExpandable && (
				<ExpandListLink
					as="button"
					type="button"
					ref={toggleButtonRef}
					onClick={toggleShowAll}
					aria-expanded={showAll ? 'true' : 'false'}
					aria-controls={listId}
				>
					{showAll ? 'Weniger zeigen' : `Alle ${tracks.length} Tracks zeigen`}
				</ExpandListLink>
			)}
		</Panel>
	)
}

export default Playlist
