import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'waitlistEntry',
  title: 'Waitlist Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) =>
        Rule.required()
          .email()
          .error('Valid email is required'),
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Where the sign-up came from (e.g., backtesting-engine)',
      options: {
        list: [
          { title: 'Backtesting Engine', value: 'backtesting-engine' },
        ],
      },
    }),
    defineField({
      name: 'notified',
      title: 'Notified',
      type: 'boolean',
      initialValue: false,
      description: 'Whether the launch notification email has been sent',
    }),
  ],
})
