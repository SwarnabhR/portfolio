import { type SchemaTypeDefinition } from 'sanity'
import { blog } from './blog'
import { gallery } from './gallery'
import { playlist } from './playlist'
import { project } from './project'
import { contactSubmission } from './contactSubmission'
import { comment } from './comment'
import { testimonial } from './testimonial'
import { faqItem } from './faqItem'
import { service } from './service'
import waitlistEntry from './waitlistEntry'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blog, gallery, playlist, project, contactSubmission, comment, testimonial, faqItem, service, waitlistEntry],
}
