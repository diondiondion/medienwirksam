import React from 'react'
import PropTypes from 'prop-types'
import {createGlobalStyle} from 'styled-components'
import Helmet from 'react-helmet'

import cssReset from '../../style/cssReset'
import theme from '../../style/theme'

import useSiteMetaData from '@components/AppWrapper/useSiteMetaData'

const GlobalStyles = createGlobalStyle`
	${cssReset}

	html {
		font-family: ${theme.fonts.default};
		font-size: 22px;

		color: ${theme.text};
		background: ${theme.background};
	}

	h1 {
		font-family: ${theme.fonts.label};
		font-size: 3em;
	}

	a {
		color: ${theme.links};
	}
`

function Layout({children}) {
	const {title} = useSiteMetaData()

	return (
		<>
			<Helmet
				title={title}
				meta={[
					{name: 'description', content: 'Sample'},
					{name: 'keywords', content: 'sample, something'},
				]}
			>
				<html lang="en" />
			</Helmet>
			<GlobalStyles />
			<div
				style={{
					margin: '0 auto',
					maxWidth: 960,
					padding: '0px 1.0875rem 1.45rem',
					paddingTop: 0,
				}}
			>
				{children}
			</div>
		</>
	)
}

Layout.propTypes = {
	children: PropTypes.node.isRequired,
}

export default Layout
