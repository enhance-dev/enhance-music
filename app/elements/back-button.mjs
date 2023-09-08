export default function BackButton ({ html }) {
  return html`
    <style>
      a {
        background: #eee;
        border-radius: 0.25em;
        color: var(--purple);
        transition: color 0.3s var(--easeOutQuint);
      }

      a:hover {
        color: var(--dark);
      }
    </style>
    <a href='/library' class='text-1 p-4 font-medium'>
      &lsaquo; Library
    </a>
  `
}
