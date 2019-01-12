module.exports = {
	siteMetadata: {
		title: 'Medienwirksam',
		audioCdnRoot: 'res.cloudinary.com/medienwirksam/video/upload/v1546451694/',
		imageCdnRoot: 'res.cloudinary.com/medienwirksam/image/upload/v1546451694/',
		altCdnRoot: 'medienwirksam-df6d.kxcdn.com',
	},
	mapping: {
		'MarkdownRemark.frontmatter.tracks': `TracksYaml.title`,
	},
	plugins: [
		'gatsby-plugin-react-helmet',
		{
			resolve: `gatsby-plugin-layout`,
			options: {
				component: require.resolve(`./src/components/appWrapper/index.jsx`),
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `playlists`,
				path: `${__dirname}/src/pages/playlists`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `tracks`,
				path: `${__dirname}/src/pages/tracks`,
			},
		},
		`gatsby-transformer-remark`,
		`gatsby-transformer-yaml`,
		'gatsby-transformer-sharp',
		'gatsby-plugin-sharp',
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: 'gatsby-starter-default',
				short_name: 'starter',
				start_url: '/',
				background_color: '#663399',
				theme_color: '#663399',
				display: 'minimal-ui',
				icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
			},
		},
		{
			resolve: 'gatsby-plugin-netlify-cms',
			options: {
				modulePath: `${__dirname}/src/cms/cms.js`,
			},
		},
		'gatsby-plugin-netlify', // make sure to keep it last in the array
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.app/offline
		// 'gatsby-plugin-offline',
	],
}
