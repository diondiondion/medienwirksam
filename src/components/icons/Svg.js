import styled from 'styled-components'
import PropTypes from 'prop-types'

function getIconSize(sizeInPx) {
	// if (sizeInPx === 0) return '0'
	// if (!sizeInPx) return undefined
	// if (typeof sizeInPx === 'string') return sizeInPx
	// return sizeInPx / 16 + 'em'
	return `${sizeInPx}px`
}

const propsToBlock = ['size', 'scale', 'dimmed', 'spacingLeft', 'spacingRight']

const Svg = styled.svg
	.withConfig({
		shouldForwardProp: prop => !propsToBlock.includes(prop),
	})
	.attrs(p => ({
		xmlns: 'http://www.w3.org/2000/svg',
		xmlnsXlink: 'http://www.w3.org/1999/xlink',
		'aria-hidden': 'true',
		width: p.size,
		height: p.size,
	}))`
	display: inline-block;
	width: ${p => p.scale}em;
	height: ${p => p.scale}em;
	${p =>
		p.spacingLeft &&
		`
		margin-left: ${p.theme.spacing[p.spacingLeft] || p.spacingLeft};
	`}
	${p =>
		p.spacingRight &&
		`
		margin-right: ${p.theme.spacing[p.spacingRight] || p.spacingRight};
	`}

	font-size: ${p => getIconSize(p.size)};
	fill: currentColor;
	stroke: transparent;
	${p =>
		p.dimmed &&
		`
		opacity: ${p.theme.dimmedTextOpacity};
	`}
`

Svg.defaultProps = {
	size: 30,
	scale: 1,
}

Svg.propTypes = {
	size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	scale: PropTypes.number,
	spacingLeft: PropTypes.string,
	spacingRight: PropTypes.string,
	dimmed: PropTypes.bool,
}

export default Svg
