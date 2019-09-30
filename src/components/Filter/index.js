import React from 'react'
import styled from 'styled-components'
import {Link} from 'gatsby'
import theme from '@style/theme'
import {fontSmoothing} from '@style/mixins'

const Wrapper = styled.nav`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin-bottom: ${theme.spacing.l};
`

const ArtistLink = styled(({isSelected, ...otherProps}) => (
	<Link {...otherProps} />
))`
	display: inline-block;
	margin-right: ${theme.spacing.xs};
	padding: ${theme.spacing.xs} ${theme.spacing.s} ${theme.spacing.xxs};

	color: ${p => (p.isSelected ? theme.background : theme.text)};
	background-color: ${p => (p.isSelected ? theme.text : theme.background)};

	font-family: ${theme.fonts.label};
	font-size: 1.25rem;
	text-transform: uppercase;
	text-decoration: none;
	${fontSmoothing}

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
	}
	&.focus-visible {
		outline: 2px solid white;
		opacity: 1;
	}

	&:last-child {
		margin-right: 0;
	}
`

function Filter({artists, selectedArtist = 'all'}) {
	return (
		<Wrapper>
			<ArtistLink to="/" isSelected={selectedArtist === 'all'}>
				Alle
			</ArtistLink>
			{artists.map(artist => (
				<ArtistLink
					key={artist.title}
					to={`/artist${artist.fields.slug}`}
					isSelected={selectedArtist === artist.title}
				>
					{artist.title}
				</ArtistLink>
			))}
		</Wrapper>
	)
}

export default Filter
