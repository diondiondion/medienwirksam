import {useStaticQuery, graphql} from 'gatsby'

function useSiteMetaData() {
	const {site} = useStaticQuery(graphql`
		query {
			site {
				siteMetadata {
					title
					audioCdnRoot
					imageCdnRoot
				}
			}
		}
	`)
	return site.siteMetadata
}

export default useSiteMetaData
