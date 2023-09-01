export default function TitleBar ({ html }) {
  return html`
    <style>
      :host {
        display: block;
        border-block-end: 1px solid var(--grey-100);
      }

      img {
        width: 2.5em;
        aspect-ratio: 246 / 200;
      }
    </style>
    <nav class='pb0'>
      <layout-container>
        <a class='no-underline flex gap-1 align-items-center' href='/library' target='library'>
          <img src='/_public/axol.svg' alt='Axol' />
          <h1 class='text1 font-medium tracking-1'>Enhance Music</h1>
        </a>
      </layout-container>
    </nav>
  `
}
