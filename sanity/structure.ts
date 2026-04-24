import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('blog').title('Blog'),
      S.documentTypeListItem('gallery').title('Gallery'),
      S.documentTypeListItem('playlist').title('Playlists'),
      S.divider(),
      S.documentTypeListItem('contactSubmission').title('Contact Inbox'),
    ])
