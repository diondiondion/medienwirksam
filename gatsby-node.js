const path = require(`path`)
const {createFilePath} = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({node, getNode, actions}) => {
	const {createNodeField} = actions
	const {type} = node.internal
	if (['MarkdownRemark', 'ArtistsYaml', 'TracksYaml'].includes(type)) {
		const slug = createFilePath({node, getNode, basePath: `pages`})
		createNodeField({node, name: `slug`, value: slug})
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
			createPage({
				path: `/artist${artist.fields.slug}`,
				component: path.resolve(`./src/templates/ArtistPage.js`),
				context: {artistFilter: [artist.title], slug: artist.fields.slug},
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
