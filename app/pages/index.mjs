export default function Index ({ html, state }) {
  const { store: { nav } } = state

  const librarySource = nav?.album ? `./album/${nav.album}` : './library'
  const playerSource = nav?.track ? `./player/${nav.track}` : 'about:blank'

  return html`
    <layout-grid>
      <title-bar></title-bar>
      <iframe
        title='Music library'
        name='library'
        src='${librarySource}'
        class='si-100vw sb-100'
      ></iframe>
      <iframe
        title='Audio player'
        name='player'
        src='${playerSource}'
        class='si-100vw absolute inset-i-0 inset-be-0'
      ></iframe>
    </layout-grid>
    <script src='/_public/browser/player-visibility.mjs'></script>
  `
}
