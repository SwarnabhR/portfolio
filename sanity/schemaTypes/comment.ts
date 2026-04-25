import { defineField, defineType } from 'sanity'

export const comment = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { name: 'name', message: 'message', date: 'createdAt' },
    prepare({ name, message, date }) {
      return {
        title: name,
        subtitle: `${date ? new Date(date).toLocaleDateString() : ''} — ${message?.slice(0, 60)}`,
      }
    },
  },
})
