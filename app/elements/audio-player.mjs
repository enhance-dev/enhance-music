export default function AudioPlayer ({ html, state }) {
  const { store } = state
  const { track } = store

  return html`
    <style scope='global'>
      /* Targets iframe's document */
      html,
      body {
        block-size: 100%;
      }
    </style>
    <figure class='flex justify-content-center align-items-center sb-100'>
      <audio autoplay controls src='${track}'></audio>
    </figure>
  `
}
