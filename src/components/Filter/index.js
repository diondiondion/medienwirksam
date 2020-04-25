import React, {useState} from 'react'
import {Link} from 'gatsby'
import styled from 'styled-components'
import {getArtistLink} from '@utils/getLink'
import theme from '@style/theme'
import {fontSmoothing} from '@style/mixins'
import TextLink from '@components/TextLink'

const Wrapper = styled.nav`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin-bottom: ${theme.spacing.l};
`

const ArtistLink = styled(TextLink).withConfig({
	shouldForwardProp: (prop, defaultPropChecker) =>
		prop !== 'isSelected' || defaultPropChecker(prop),
})`
	display: inline-block;
	margin-right: ${theme.spacing.xs};
	padding: ${theme.spacing.xs} ${theme.spacing.s} ${theme.spacing.xxs};

	color: ${p => (p.isSelected ? theme.background : theme.text)};
	background-color: ${p => (p.isSelected ? theme.text : theme.background)};

	font-family: ${theme.fonts.label};
	font-size: 1.25rem;
	font-weight: normal;
	text-transform: uppercase;
	text-decoration: none;
	${fontSmoothing}
	border: none;

	transition: opacity 250ms ease, transform 250ms ease;
	opacity: ${p => (p.isSelected ? '1' : '0.75')};
	transform: rotate(0deg);

	${p =>
		p.isSelected &&
		`
		transform: rotate(${(Math.random() * 7 - 3.5).toFixed(2)}deg);
	`}

	&:hover {
		opacity: 1;
		text-decoration: none;
	}

	&.focus-visible {
		outline: 2px solid white;
		opacity: 1;
	}

	&:last-child {
		margin-right: 0;
	}
`

function ArtistList({artists, selectedArtist}) {
	return (
		<>
			{artists.map(artist => (
				<ArtistLink
					key={artist.title}
					as={Link}
					to={getArtistLink(artist)}
					isSelected={selectedArtist === artist.title}
				>
					{artist.title}
				</ArtistLink>
			))}
		</>
	)
}

function Filter({artists, selectedArtist = 'all'}) {
	const medienwirksam = artists.filter(a => a.isMedienwirksam)
	const guests = artists.filter(a => !a.isMedienwirksam)

	const [showGuests, setShowGuests] = useState(
		guests.map(g => g.title).includes(selectedArtist)
	)

	return (
		<Wrapper>
			{!showGuests && (
				<ArtistLink as={Link} to="/" isSelected={selectedArtist === 'all'}>
					Alle
				</ArtistLink>
			)}
			{showGuests && (
				<ArtistLink
					as="button"
					type="button"
					onClick={() => setShowGuests(!showGuests)}
					aria-label="Medienwirksam"
				>
					…
				</ArtistLink>
			)}
			<ArtistList
				artists={showGuests ? guests : medienwirksam}
				selectedArtist={selectedArtist}
			/>
			{!showGuests && (
				<ArtistLink
					as="button"
					type="button"
					aria-label="Gäste"
					onClick={() => setShowGuests(!showGuests)}
				>
					…
				</ArtistLink>
			)}
		</Wrapper>
	)
}

export default Filter
