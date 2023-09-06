const playeriFrame = document.querySelector('iframe[name="player"]')

// Hide the player iframe initially
playeriFrame.classList.add('hidden')

// Reveal the player iframe when it's loaded with an audio track (aka when the pathname includes `player`)
playeriFrame.addEventListener('load', () => {
  const { pathname } = playeriFrame.contentWindow.location
  pathname.includes('player') && playeriFrame.classList.remove('hidden')
})
