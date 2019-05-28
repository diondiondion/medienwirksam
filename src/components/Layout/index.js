import React from 'react'
import PropTypes from 'prop-types'
import styled, {createGlobalStyle} from 'styled-components'
import {Helmet} from 'react-helmet'

import cssReset from '@style/cssReset'
import theme from '@style/theme'

import logoImage from '@assets/images/logo.svg'
import backgroundImage from '@assets/images/background-xl.jpg'

import useSiteMetaData from '@utils/useSiteMetaData'

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
	margin: 1rem auto 0;
	padding: 1rem;
	padding-bottom: 12rem;
	max-width: 2000px;
`

const Logo = styled.img`
	display: block;
	margin: 0 auto 2rem;
	max-width: 100%;
	height: auto;
`

function Layout({children, withoutLogo}) {
	const {title: siteTitle} = useSiteMetaData()

	return (
		<>
			<Helmet
				title={siteTitle}
				meta={[
					{name: 'description', content: ''},
					{name: 'keywords', content: ''},
				]}
			/>
			<GlobalStyles />
			<PageWrapper>
				{!withoutLogo && (
					<Logo src={logoImage} alt="Medienwirksam" width="730" height="92" />
				)}
				{children}
			</PageWrapper>
		</>
	)
}

Layout.propTypes = {
	children: PropTypes.node.isRequired,
	withoutLogo: PropTypes.bool,
}

export default Layout
