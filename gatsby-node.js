const path = require(`path`)
const {createFilePath} = require(`gatsby-source-filesystem`)

function getRandomColor() {
	const letters = '0123456789ABCDEF'
	let color = '#'
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

exports.onCreateNode = ({node, getNode, actions}) => {
	const {createNodeField} = actions
	const {type} = node.internal
	if (['MarkdownRemark', 'ArtistsYaml', 'TracksYaml'].includes(type)) {
		const slug = createFilePath({node, getNode, basePath: `pages`})
		createNodeField({node, name: `slug`, value: slug})
	}
	if (type === 'TracksYaml') {
		createNodeField({node, name: `randomColor`, value: getRandomColor()})
	}
}

exports.createPages = ({graphql, actions}) => {
	const {createPage} = actions
	return graphql(`
		{
			allMarkdownRemark {
				edges {
					node {
						fields {
							slug
						}
						frontmatter {
							title
						}
					}
				}
			}
			allArtistsYaml(sort: {fields: title, order: ASC}) {
				nodes {
					title
					alias
					fields {
						slug
					}
				}
			}
			allTracksYaml(sort: {fields: title, order: ASC}) {
				nodes {
					title
					fields {
						slug
					}
				}
			}
		}
	`).then(result => {
		result.data.allMarkdownRemark.edges.forEach(({node}) => {
			createPage({
				path: `/playlist${node.fields.slug}`,
				component: path.resolve(`./src/templates/PlaylistPage.js`),
				context: {slug: node.fields.slug},
			})
		})

		result.data.allArtistsYaml.nodes.forEach(artist => {
			const {
				fields: {slug},
				title,
				alias,
			} = artist
			const artistFilter =
				alias && alias.length ? [title, ...artist.alias] : [title]
			createPage({
				path: `/artist${slug}`,
				component: path.resolve(`./src/templates/ArtistPage.js`),
				context: {
					artistFilter,
					slug,
				},
			})
		})
		result.data.allTracksYaml.nodes.forEach(track => {
			createPage({
				path: `/track${track.fields.slug}`,
				component: path.resolve(`./src/templates/TrackPage.js`),
				context: {slug: track.fields.slug},
			})
		})
	})
}
