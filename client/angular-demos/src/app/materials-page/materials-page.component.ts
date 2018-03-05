// ng
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { trigger, state, style, animate, transition } from '@angular/animations'

// rx
import 'rxjs/add/operator/filter'

// app
import { BackendService } from '../backend.service'
import { StateService } from '../state.service'
import { UIService } from '../ui.service'
import { Material } from '../interfaces'


@Component({
  selector: 'app-materials-page',
  templateUrl: './materials-page.component.html',
  styleUrls: ['./materials-page.component.css'],
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
export class MaterialsPageComponent implements OnInit {

  @ViewChild('nextButton') nextButton: ElementRef

  mediaBar = false
  selectedMaterial: Material

  constructor(
    // ng
    public router: Router,
    public route: ActivatedRoute,
    // app
    public backend: BackendService,
    public state: StateService,
    public ui: UIService,
  ) {
    window.onscroll = () => {
      const buttonFromTop = this.nextButton.nativeElement.getBoundingClientRect().top
      // console.log(buttonFromTop)
      if (buttonFromTop < 800) {
        this.backend.loadMaterialsPage(this.state.materials.filter)
      }
    }
    this.ui.shortcutStream.filter(val => val === 'esc').subscribe(() => {
      this.closeModal()
    })
    this.ui.shortcutStream.filter(val => val === 'm').subscribe(() => {
      this.mediaBar = !this.mediaBar
    })
    this.ui.imageClickStream.subscribe(url => {
      this.selectedMaterial.imageURL = url
    })
  }

  ngOnInit() {
    // initial loading
    this.backend.loadMaterialsPage(this.state.materials.filter)
    this.backend.loadImages()

    // open material in modal if ID is present in current route
    this.route.params.take(1).subscribe(params => {
      const param = params.param
      if (param === 'list') { return }
      this.backend.loadMaterialById(param)
        .subscribe((reply: Material) => {
          this.selectMaterial(reply)
        })
   })
  }

  selectMaterial(material: Material) {
    this.selectedMaterial = material
    this.router.navigate(['/materials', material.id])
  }

  closeModal() {
    this.selectedMaterial = undefined
    this.router.navigate(['/materials', 'list'])
  }

  applyFilter(filter: string) {
    this.backend.materials = []
    this.backend.firstPageLoaded = false
    this.state.materials.filter = filter
    this.backend.loadMaterialsPage(this.state.materials.filter)
  }

}
