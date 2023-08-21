export default function RecentlyPlayed ({ html, state }) {
  const { store } = state
  const { recent } = store

  return html`
    <section class='mb4'>
      <layout-container>
        <h2 class='text2 font-medium tracking-1 mbe2'>Recently Played</h2>
        <album-grid>
          ${recent.map(({ id, cover, title, artist, year }) => `<li>
            <album-item id='${id}' cover='${cover}' title='${title}' artist='${artist}' year='${year}'></album-item>
          </li>`).join('')}
        </album-grid>
      </layout-container>
    </section>
  `
}
