export default function formatTime (seconds) {
  const minutes = Math.floor(seconds / 60)
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes
  const remainingSeconds = Math.floor(seconds % 60)
  const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds
  
  return `${formattedMinutes}:${formattedSeconds}`
}
