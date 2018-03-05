// ng
import { Component, OnInit } from '@angular/core'

// app
import { UIService } from '../ui.service'

@Component({
  selector: 'app-content-width',
  templateUrl: './content-width.component.html',
  styleUrls: ['./content-width.component.css']
})
export class ContentWidthComponent implements OnInit {

  constructor(
    public ui: UIService,
  ) { }

  ngOnInit() {
  }

}
