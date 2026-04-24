import { defineField, defineType } from 'sanity'

export const playlist = defineType({
  name: 'playlist',
  title: 'Playlist',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Spotify', value: 'spotify' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'youtubePlaylistId',
      title: 'YouTube Playlist ID',
      type: 'string',
      description: 'The playlist ID from a YouTube playlist URL (for YouTube playlists)',
      hidden: ({ parent }) => parent?.platform !== 'youtube',
    }),
    defineField({
      name: 'spotifyPlaylistId',
      title: 'Spotify Playlist ID',
      type: 'string',
      description: 'The playlist ID from a Spotify playlist URL (for Spotify playlists)',
      hidden: ({ parent }) => parent?.platform !== 'spotify',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Finance', value: 'finance' },
          { title: 'ML/AI', value: 'ml-ai' },
          { title: 'Music', value: 'music' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
      platform: 'platform',
    },
    prepare({ title, media, platform }) {
      return {
        title,
        media,
        subtitle: platform ? `${platform.charAt(0).toUpperCase() + platform.slice(1)} Playlist` : 'Playlist',
      }
    },
  },
})
