import React from 'react'
import styled from 'styled-components'

const StackWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
`

const StackBox = styled.div`
	&:not(:last-child) {
		margin-bottom: ${p => p.theme.spacing[p.spacing] || p.spacing};
	}
`

function Stack({spacing, children}) {
	return (
		<StackWrapper>
			{React.Children.map(children, (child, index) => {
				if (!child) return null
				return (
					<StackBox key={index} spacing={spacing || 'm'}>
						{child}
					</StackBox>
				)
			})}
		</StackWrapper>
	)
}

export default Stack
