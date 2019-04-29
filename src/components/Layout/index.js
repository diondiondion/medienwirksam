import React from 'react'
import PropTypes from 'prop-types'
import styled, {createGlobalStyle} from 'styled-components'
import {Helmet} from 'react-helmet'
import {Link} from 'gatsby'

import cssReset from '@style/cssReset'
import theme from '@style/theme'

import logoImage from '@assets/images/logo.svg'
import backgroundImage from '@assets/images/background-xl.jpg'

import useSiteMetaData from '@utils/useSiteMetaData'

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

		@media (min-width: 800px) {
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
`

const PageWrapper = styled.div`
	margin: 0 auto;
	padding: 1rem;
	padding-bottom: 8rem;
	max-width: 2000px;
`

const Logo = styled.img`
	display: block;
	margin: 1rem auto 2rem;
	max-width: 100%;
	height: auto;
`

function Layout({children}) {
	const {title} = useSiteMetaData()

	return (
		<>
			<Helmet
				title={title}
				meta={[
					{name: 'description', content: ''},
					{name: 'keywords', content: ''},
				]}
			/>
			<GlobalStyles />
			<PageWrapper>
				<Link to="/">
					<Logo src={logoImage} alt="Medienwirksam" width="730" height="92" />
				</Link>
				{children}
			</PageWrapper>
		</>
	)
}

Layout.propTypes = {
	children: PropTypes.node.isRequired,
}

export default Layout
