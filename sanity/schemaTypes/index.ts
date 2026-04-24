import { type SchemaTypeDefinition } from 'sanity'
import { blog } from './blog'
import { gallery } from './gallery'
import { playlist } from './playlist'
import { project } from './project'
import { contactSubmission } from './contactSubmission'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blog, gallery, playlist, project, contactSubmission],
}
