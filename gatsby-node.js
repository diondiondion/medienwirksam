const path = require(`path`)
const {createFilePath} = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({node, getNode, actions}) => {
	const {createNodeField} = actions
	const {type} = node.internal
	if (type === `MarkdownRemark` || type === `ArtistsYaml`) {
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
					isMedienwirksam
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
				component: path.resolve(`./src/templates/Playlist.js`),
				context: {slug: node.fields.slug},
			})
		})
		result.data.allArtistsYaml.nodes.forEach(artist => {
			const artistFilter = [artist.title]
			createPage({
				path: `/artist${artist.fields.slug}`,
				component: path.resolve(`./src/templates/Artist.js`),
				context: {artistFilter, slug: artist.fields.slug},
			})
		})
	})
}
