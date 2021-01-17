import React, {useState, useRef, useEffect} from 'react'
import {Link} from 'gatsby'
import styled, {keyframes} from 'styled-components'
import {motion} from 'framer-motion'
import invert from 'invert-color'

import {getTrackLink} from '@utils/getLink'
import friendlyList from '@utils/friendlyList'
import {
	DownloadIcon,
	IsPlayingIcon,
	MoreIcon,
	WaveformIcon,
} from '@components/icons'
import TextLink from '@components/TextLink'
import VisuallyHidden from '@components/VisuallyHidden'
import {buttonReset} from '@style/mixins'
import {
	Menu,
	MenuList as ReachMenuList,
	MenuButton as ReachMenuButton,
	MenuLink as ReachMenuLink,
} from '@reach/menu-button'

const filterStyleProps = {
	shouldForwardProp: prop => !['color', 'isPlaying'].includes(prop),
}

const Tracklist = styled.ol.attrs({
	role: 'list',
})`
	margin: 0;
	padding: 0;
`

const TracklistItem = styled.li.attrs({
	role: 'listitem',
})`
	position: relative;
	z-index: 0;

	display: flex;
	justify-content: space-between;
	white-space: nowrap;

	color: ${p => (p.isPlaying ? invert(p.contrastColor, true) : 'inherit')};
	background: transparent;
	font-weight: ${p => (p.isPlaying ? 'bold' : 'normal')};

	list-style: none;
	counter-increment: track-counter;
`

const TrackNameWrapper = styled.span`
	flex: 1 1 0;
	min-width: 0;
`

const TrackButton = styled.button.attrs({type: 'button'})`
	display: inline-block;
	vertical-align: middle;
	max-width: 100%;
	margin: 0;
	padding: ${p => p.theme.spacing.xs} 0;
	border: none;
	appearance: none;
	cursor: pointer;

	font: inherit;
	text-decoration: none;
	text-align: left;

	color: inherit;
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

const TrackHighlightWrapper = styled(motion.span).withConfig(filterStyleProps)`
	position: absolute;
	top: 0;
	left: -${p => p.theme.spacing.xl};
	right: -${p => p.theme.spacing.s};
	bottom: 0;
	z-index: -1;
`

const TrackHighlight = styled.span`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	display: flex;
	padding-left: ${p => p.theme.spacing.s};
	align-items: center;

	color: ${p => invert(p.color, true)};
	background-color: ${p => p.color};

	transform: rotate(${(Math.random() * 1.6 - 0.8).toFixed(2)}deg);
`

const MenuButton = styled(ReachMenuButton).withConfig(filterStyleProps)`
	${buttonReset}

	display: flex;
	align-items: center;
	margin-left: ${p => p.theme.spacing.xs};

	font-size: ${p => p.theme.typeScale.xxs};
	opacity: 0.75;
	transition: opacity 250ms ease-in-out;

	${p =>
		p.isPlaying &&
		`
		opacity: 1;
	`}

	&:focus, &:hover, &[aria-expanded="true"] {
		opacity: 1;
	}
`

const fadeInFromTop = keyframes`
	from {
		opacity: 0;
		transform: translateY(-5px) rotate(0deg);
	}
`

const MenuList = styled(ReachMenuList).withConfig(filterStyleProps)`
	padding: ${p => p.theme.spacing.xs} 0;

	color: ${p => invert(p.isPlaying ? p.color : p.theme.panel, true)};
	background-color: ${p => (p.isPlaying ? p.color : p.theme.panel)};

	box-shadow: 0 0 30px
		${p => invert(p.isPlaying ? p.color : p.theme.panel, true)}2b;

	transform: rotate(${(Math.random() * 1.6 - 0.8).toFixed(2)}deg);
	animation: ${fadeInFromTop} 250ms backwards ease-out;
`

const MenuLink = styled(ReachMenuLink).withConfig(filterStyleProps)`
	display: block;
	padding: ${p => p.theme.spacing.xs} ${p => p.theme.spacing.s};

	color: inherit;
	font-size: ${p => p.theme.typeScale.xs};
	text-decoration: none;

	&[data-selected] {
		text-decoration: underline;
		color: ${p => invert(p.color, true)};
		background-color: ${p => (p.isPlaying ? 'rgba(0 0 0 / 15%)' : p.color)};
	}
`

const ExpandListLink = styled(TextLink)`
	padding: 0.5rem 1.5rem;
	margin-bottom: -0.5rem;
	width: 100%;
	text-align: left;
`

function Playlist({
	id: listId,
	data,
	maxTrackCount = Infinity,
	color,
	currentTrack,
	shouldExcludeArtist = () => false,
	onPlay,
}) {
	function playTrack(e, trackIndex) {
		e.preventDefault()
		onPlay(trackIndex)
	}

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

	return (
		<>
			<Tracklist id={listId}>
				{data.tracks.map((track, index) => {
					if (!track) {
						return (
							<TracklistItem key={index}>
								Track {index + 1} nicht gefunden
							</TracklistItem>
						)
					}

					const shouldTrackBeHidden = !showAll && index + 1 > maxTrackCount
					const shouldTrackBeFocusedAfterExpanding = index === maxTrackCount

					if (shouldTrackBeHidden) {
						return null
					}

					const mainArtist =
						track.artistsAlias ||
						(track.artists.length === 1 ? track.artists[0] : null)
					const showMainArtist = !shouldExcludeArtist(mainArtist)

					const isPlaying =
						currentTrack &&
						currentTrack.title === track.title &&
						!shouldTrackBeHidden

					return (
						<TracklistItem
							key={track.title}
							isPlaying={isPlaying}
							contrastColor={color}
						>
							<TrackNameWrapper>
								<TrackButton
									ref={
										shouldTrackBeFocusedAfterExpanding
											? firstExpandedTrackRef
											: undefined
									}
									onClick={e => playTrack(e, index)}
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
								</TrackButton>
							</TrackNameWrapper>
							<Menu>
								<MenuButton isPlaying={isPlaying}>
									<VisuallyHidden>Mehr Optionen</VisuallyHidden>
									<MoreIcon scale={0.666} />
								</MenuButton>
								<MenuList color={color} isPlaying={isPlaying}>
									<MenuLink
										forwardedAs={Link}
										to={getTrackLink(track)}
										state={{
											trackContext: {
												playlist: data,
												index,
											},
										}}
										isPlaying={isPlaying}
										color={color}
									>
										<WaveformIcon scale={0.666} spacingRight="xs" />
										Track Info
									</MenuLink>
									<MenuLink
										download
										href={`/download/${track.filename}`}
										isPlaying={isPlaying}
										color={color}
									>
										<DownloadIcon scale={0.666} spacingRight="xs" />
										Mp3 runterladen
									</MenuLink>
								</MenuList>
							</Menu>
							{isPlaying && (
								<TrackHighlightWrapper layoutId={`${listId}-trackHighlight`}>
									<TrackHighlight color={color}>
										<IsPlayingIcon scale={0.75} />
									</TrackHighlight>
								</TrackHighlightWrapper>
							)}
						</TracklistItem>
					)
				})}
			</Tracklist>
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
