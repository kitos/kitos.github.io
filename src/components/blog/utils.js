export let langToEmoji = lang => (lang === 'en' ? '🇬🇧' : '🇷🇺')

export let buildPostLink = ({ slug, lang }) => `/${lang}/blog/${slug}/`
