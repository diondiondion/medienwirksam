import React from 'react'
import PropTypes from 'prop-types'
import styled, {createGlobalStyle} from 'styled-components'
import {Helmet} from 'react-helmet'
import {Link} from 'gatsby'

import cssReset from '@style/cssReset'
import theme from '@style/theme'

import logoImage from '@assets/images/logo.svg'
import backgroundImage from '@assets/images/background-xl.jpg'

import {PAGE_TITLE} from '@constants'

import 'focus-visible'

const GlobalStyles = createGlobalStyle`
	${cssReset}

	html {
		font-family: ${theme.fonts.default};
		font-size: 16px;

		color: ${theme.text};
		background-color: ${theme.background};
		background-image: url(${backgroundImage});
		background-size: 100% auto;
		background-position: top;
		background-repeat: no-repeat;

		overflow-y: scroll;

		@media (min-width: ${theme.breakpoints.xs}) {
			font-size: 18px;
		}

		@media (min-width: ${theme.breakpoints.m}) {
			font-size: 22px;
		}
	}

	h1 {
		font-family: ${theme.fonts.label};
		font-size: 3em;
	}

	p {
		margin: 0
	}

	a {
		color: ${theme.links};
	}

	*:focus:not(:focus-visible) {
		outline: none;
	}

	*:focus:not(.focus-visible) {
		outline: none;
	}
`

const PageWrapper = styled.div`
	margin: 0 auto;
	padding: 2rem 1rem 6rem;
	max-width: 1800px;
`

const imageSize = {
	width: 730,
	height: 92,
}

const LogoLink = styled(Link)`
	display: block;
	margin: 0 auto ${theme.spacing.l};
	max-width: ${imageSize.width}px;
`

const Logo = styled.img`
	display: block;
	max-width: 100%;
	height: auto;
`

function Layout({
	children,
	pageTitle,
	description = '',
	slug = '',
	imageUrl,
	withoutLogo,
}) {
	const title = pageTitle ? `${pageTitle} - ${PAGE_TITLE}` : PAGE_TITLE
	const fullUrl = `https://medienwirksam.de${slug}`

	return (
		<>
			<Helmet
				title={title}
				htmlAttributes={{
					lang: 'de',
				}}
				meta={[
					{name: 'description', content: description},
					{name: 'keywords', content: ''},
				]}
			>
				<meta property="og:title" content={title} />
				<meta property="og:type" content="website" />
				<meta property="og:description" content={description} />
				{imageUrl && <meta property="og:image" content={imageUrl} />}
				{fullUrl && <meta property="og:url" content={fullUrl} />}
				<meta itemProp="name" content={title} />
				<meta itemProp="description" content={description} />
				<meta name="twitter:card" content="summary" />
				{imageUrl && (
					<meta name="twitter:image" property="og:image" content={imageUrl} />
				)}
				{fullUrl && (
					<meta name="twitter:url" property="og:url" content={fullUrl} />
				)}
				<meta name="twitter:title" property="og:title" content={title} />
				<meta
					name="twitter:description"
					property="og:description"
					content={description}
				/>
			</Helmet>
			<GlobalStyles />
			<PageWrapper>
				{!withoutLogo && (
					<LogoLink to="/" aria-label="Zur Startseite">
						<Logo
							src={logoImage}
							alt="Medienwirksam"
							width={imageSize.width}
							height={imageSize.height}
						/>
					</LogoLink>
				)}
				{children}
			</PageWrapper>
		</>
	)
}

Layout.propTypes = {
	children: PropTypes.node.isRequired,
	description: PropTypes.string,
	imageUrl: PropTypes.string,
	pageTitle: PropTypes.string,
	slug: PropTypes.string,
	withoutLogo: PropTypes.bool,
}

export default Layout
