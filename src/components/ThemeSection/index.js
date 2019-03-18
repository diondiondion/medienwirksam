import React from 'react'
import {ThemeProvider} from 'styled-components'
import invert from 'invert-color'

function ThemeSection({color: background, children}) {
	const textColor = invert(background, true)

	const highlight = {
		color: textColor,
		background,
	}

	return (
		<ThemeProvider theme={theme => ({...theme, highlight})}>
			{children}
		</ThemeProvider>
	)
}

export default ThemeSection
