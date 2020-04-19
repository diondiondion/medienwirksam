import React from 'react'
import styled from 'styled-components'

const StackWrapper = styled.span`
	display: flex;
	flex-wrap: wrap;
	flex-direction: ${p => (p.inline ? 'row' : 'column')};
	justify-content: flex-start;
`

const StackBox = styled.span`
	max-width: 100%;

	&:not(:last-child) {
		${p => (p.inline ? 'margin-right' : 'margin-bottom')}: ${p =>
			p.theme.spacing[p.spacing] || p.spacing};
	}
`

function Stack({inline, spacing, children}) {
	return (
		<StackWrapper inline={inline}>
			{React.Children.map(children, (child, index) => {
				if (!child) return null
				return (
					<StackBox key={index} spacing={spacing || 'm'} inline={inline}>
						{child}
					</StackBox>
				)
			})}
		</StackWrapper>
	)
}

export default Stack
