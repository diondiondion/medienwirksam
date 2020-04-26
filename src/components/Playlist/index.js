import React, {useState, useCallback, useRef, useEffect} from 'react'
import {Link} from 'gatsby'
import styled from 'styled-components'
import {Flipper, Flipped} from 'react-flip-toolkit'
import invert from 'invert-color'

import {getTrackLink} from '@utils/getLink'
import friendlyList from '@utils/friendlyList'
import {IsPlayingIcon, WaveformIcon} from '@components/icons'
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
	display: flex;
	justify-content: space-between;
	white-space: nowrap;

	list-style: none;
	counter-increment: track-counter;

	${p =>
		p.isHidden &&
		`
		display: none;
	`}
`

const TrackNameWrapper = styled.span`
	position: relative;
	flex: 1 1 0;
	min-width: 0;
`

const TrackButton = styled.button.attrs({type: 'button'})`
	position: relative;
	z-index: 0;
	display: inline-block;
	vertical-align: middle;
	max-width: 100%;
	margin: 0;
	padding: ${p => p.theme.spacing.xs} 0;
	border: none;
	appearance: none;
	cursor: pointer;

	font: inherit;
	font-weight: ${p => (p.isPlaying ? 'bold' : 'normal')};
	text-decoration: none;
	text-align: left;

	color: ${p => (p.isPlaying ? invert(p.contrastColor, true) : 'inherit')};
	background-color: transparent;

	&.focus-visible {
		outline: 2px solid currentcolor;
		outline-offset: 4px;
	}
`

const TrackTitle = styled.span`
	position: relative;
	display: inline-block;
	vertical-align: top;
	max-width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	&::before {
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

const LinkToTrackPage = styled(TextLink)`
	display: flex;
	align-items: center;
	margin-left: ${p => p.theme.spacing.m};
	margin-right: -${p => p.theme.spacing.xs};
	font-size: ${p => p.theme.typeScale.xxs};
	opacity: 0;
	transition: opacity 250ms ease-in-out;

	&:focus,
	${TracklistItem}:hover & {
		opacity: 1;
	}
	${TracklistItem}:focus-within & {
		opacity: 1;
	}
`

const ExpandListLink = styled(TextLink)`
	padding: 0.5rem 1.5rem;
	margin-bottom: -0.5rem;
	width: 100%;
	text-align: left;
`

function Playlist({
	id,
	data,
	maxTrackCount = Infinity,
	color,
	currentTrack,
	shouldExcludeArtist = () => false,
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
	const isExpandable = data?.tracks?.length > maxTrackCount
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
		<>
			<Flipper flipKey={currentTrack && currentTrack.title}>
				<Tracklist id={listId}>
					{data.tracks.map((track, index) => {
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
								<TrackNameWrapper isSelected={isPlaying} selectionColor={color}>
									<TrackButton
										ref={
											shouldTrackBeFocusedAfterExpanding
												? firstExpandedTrackRef
												: undefined
										}
										isPlaying={isPlaying}
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
													<IsPlayingIcon scale={0.75} />
												</TrackHighlight>
											</Flipped>
										)}
									</TrackButton>
								</TrackNameWrapper>
								<LinkToTrackPage
									as={Link}
									to={getTrackLink(track)}
									state={{
										trackContext: {
											playlist: data,
											index,
										},
									}}
								>
									Info <WaveformIcon scale={0.666} />
								</LinkToTrackPage>
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
					{showAll
						? 'Weniger zeigen'
						: `Alle ${data?.tracks?.length} Tracks zeigen`}
				</ExpandListLink>
			)}
		</>
	)
}

export default Playlist
