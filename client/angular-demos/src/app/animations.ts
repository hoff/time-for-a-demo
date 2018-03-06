import { trigger, state, style, animate, transition, stagger } from '@angular/animations'

export const animations = {
  fadeInOut: trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0.5 }),
      animate(150, style({ opacity: 1, transform: 'scale(1)' }))
    ]),
    transition(':leave', [
      animate(50, style({ opacity: 0.3, transform: 'scale(1)' }))
    ])
  ])
}
