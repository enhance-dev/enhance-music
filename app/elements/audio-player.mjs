export default function AudioPlayer ({ html, state }) {
  const { store } = state
  const { track } = store

  return html`
    <figure class='flex justify-content-center'>
      <audio autoplay controls src='${track}'></audio>
    </figure>
  `
}
