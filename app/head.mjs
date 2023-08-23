import { getStyles }  from '@enhance/arc-plugin-styles'

const { linkTag } = getStyles

export default function Head () {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Enhance Music</title>
      ${linkTag()}
      <link rel="icon" href="/_public/favicon.svg">
      <meta name="description" content="A music player built with Enhance, the HTML first full stack web framework.">
      <style>
        body {
          color: var(--dark);
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
