export default function TitleBar ({ html }) {
  return html`
    <style>
      :host {
        display: block;
        border-block-end: 1px solid gainsboro;
      }

      img {
        width: 2.5em;
        aspect-ratio: 246 / 200;
      }
    </style>
    <nav class='pb0'>
      <layout-container class='flex align-items-center'>
        <a class='no-underline flex gap-1 align-items-center' href='/library' target='library'>
          <img src='/_public/axol.svg' alt='Axol' />
          <h1 class='text1 font-medium tracking-1'>Enhance Music</h1>
        </a>
        <div class='mis-auto flex gap0'>
          <a class='underline text-1 font-medium' href='https://enhance.dev'>Enhance</a>
          <a class='underline text-1 font-medium' href='https://github.com/enhance-dev/enhance-music'>GitHub</a>
        </div>
      </layout-container>
    </nav>
  `
}
