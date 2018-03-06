// ng
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'

// rx
import 'rxjs/add/operator/filter'

// app
import { environment } from '../environments/environment'
import { BackendService } from './backend.service'
import { UIService } from './ui.service'
import { animations } from './animations'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    animations.fadeInOut,
  ]
})
export class AppComponent implements OnInit {

  environment

  navItems = [
    {name: 'Models', link: ['/models/list']},
    {name: 'Materials', link: ['/materials/list']},
    {name: 'Images', link: ['/images/list']},
    {name: 'Users', link: ['/users/list']},
    {name: 'Customers', link: ['/customers/list']},
    {name: 'Tags', link: ['/tags/list']},
  ]

  constructor(
    public backend: BackendService,
    public ui: UIService,
  ) {
    this.environment = environment
  }

  ngOnInit() {
  }
}
