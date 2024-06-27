module.exports = {
	mapping: {
		'MarkdownRemark.frontmatter.tracks': `TracksYaml.title`,
	},
	plugins: [
		{
			resolve: 'gatsby-plugin-eslint',
			options: {
				test: /\.js$|\.jsx$/,
				exclude: /(node_modules|.cache|public)/,
				stages: ['develop'],
				options: {
					emitWarning: true,
					failOnError: false,
				},
			},
		},
		{
			resolve: `gatsby-plugin-alias-imports`,
			options: {
				alias: {
					'@constants': './src/constants.js',
					'@assets': './src/assets',
					'@components': './src/components',
					'@pages': './src/pages',
					'@style': './src/style',
					'@templates': './src/templates',
					'@utils': './src/utils',
				},
			},
		},
		'gatsby-plugin-react-helmet',
		{
			resolve: `gatsby-plugin-layout`,
			options: {
				component: require.resolve(`./src/components/AppWrapper/index.js`),
			},
		},
		{
			resolve: 'gatsby-plugin-web-font-loader',
			options: {
				custom: {
					families: ['Impact Label Reversed'],
				},
			},
		},
		`gatsby-plugin-styled-components`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `artists`,
				path: `${__dirname}/src/pages/artists`,
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
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: 'Medienwirksam',
				short_name: 'MW',
				start_url: '/',
				background_color: '#030926',
				theme_color: '#030926',
				display: 'standalone',
				icon: 'src/assets/images/favicon.png', // This path is relative to the root of the site.
			},
		},
		'gatsby-plugin-netlify', // make sure to keep it last in the array
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.app/offline
		// 'gatsby-plugin-offline',
	],
}
