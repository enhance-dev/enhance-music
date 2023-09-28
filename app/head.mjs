import { getStyles }  from '@enhance/arc-plugin-styles'

const { linkTag } = getStyles

export default function Head (state) {
  const { store, req } = state
  const { session } = req

  if (session?.album) {
    store.nav = {
      ...store.nav,
      album: session.album,
    }
  }

  if (session?.track) {
    store.nav = {
      ...store.nav,
      track: session.track,
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Enhance Music</title>
      ${linkTag()}
      <link rel="icon" href="/_public/axol.svg">
      <!-- Open Graph -->
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://enhance-music.com" />
      <meta property="og:title" content="Enhance Music" />
      <meta property="og:description" content="A music library and audio player, built with HTML, CSS, JavaScript, and Enhance." />
      <meta property="og:image" content="https://enhance-music.com/_public/enhance-music-og.png" />
      <!-- Twitter -->
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://enhance-music.com" />
      <meta property="twitter:title" content="Enhance Music" />
      <meta property="twitter:description" content="A music library and audio player, built with HTML, CSS, JavaScript, and Enhance." />
      <meta property="twitter:image" content="https://enhance-music.com/_public/enhance-music-og.png" />
      <link rel="manifest" href="/_public/app.webmanifest" />
      ${req.rawPath === '/' ? '<script async type="module" src="/_public/browser/sw.mjs"></script>' : ''}
      <meta name="description" content="A music library and audio player, built with HTML, CSS, JavaScript, and Enhance.">
      <meta name="view-transition" content="same-origin" />
      <style>
        body {
          color: var(--dark);
          min-block-size: 0;
        }

        .muted {
          color: var(--muted);
        }

        .numeric {
          font-variant-numeric: tabular-nums;
        }
      </style>
    </head>
    <body class='font-sans leading3'>
`
}
