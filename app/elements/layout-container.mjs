export default function LayoutContainer ({ html }) {
  return html`
    <style>
      :host {
        display: block;
        margin-inline: auto;
        max-inline-size: 80rem;
        padding-inline: var(--space-0);
      }
    </style>
    <slot></slot>
  `
}
