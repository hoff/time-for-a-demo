// ng
import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { trigger, state, style, animate, transition } from '@angular/animations'

// app
import { UIService } from '../ui.service'

@Component({
  selector: 'app-modal-overlay',
  templateUrl: './modal-overlay.component.html',
  styleUrls: ['./modal-overlay.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
          style({ opacity: 0.5 }),
          animate(150, style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
          animate(50, style({ opacity: 0.3, transform: 'scale(1)' }))
      ])
  ]),
  ]
})
export class ModalOverlayComponent implements OnInit {

  @Output('close') close = new EventEmitter()

  constructor(
    public ui: UIService,
  ) { }

  ngOnInit() {
  }

}
