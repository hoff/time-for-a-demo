// ng
import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material'

// rx
import 'rxjs/add/operator/filter'

// app
import { BackendService } from '../backend.service'
import { UIService } from '../ui.service'
import { animations } from '../animations'
import { Material } from '../interfaces'


@Component({
  selector: 'app-materials-page',
  templateUrl: './materials-page.component.html',
  styleUrls: ['./materials-page.component.css'],
  animations: [
    animations.fadeInOut,
  ]
})
export class MaterialsPageComponent implements OnInit {

  @ViewChild('nextButton') nextButton: ElementRef

  // the material to be shown in the details overlay
  selectedMaterial: Material

  constructor(
    // ng
    public router: Router,
    public route: ActivatedRoute,
    public snackBar: MatSnackBar,
    // app
    public backend: BackendService,
    public ui: UIService,
  ) {
    // infinity scroll mechanism
    this.setupInfiniteScroll()

    // shortcut subscriptions
    this.ui.shortcutStream.filter(val => val === 'esc').subscribe(() => {
      this.closeModal()
    })
    // listen to image clicks
    this.ui.imageClickStream.subscribe(url => {
      this.selectedMaterial.imageURL = url
    })
  }

  /**
   * creates an infinite-scroll mechansism
   * by attaching logic to the window's onscoll event
   */
  setupInfiniteScroll() {
    window.onscroll = () => {
      if (!this.backend.flags.infinityScroll) { return }
      const buttonFromTop = this.nextButton.nativeElement.getBoundingClientRect().top
      const eagerness = window.innerHeight * 2
      if (buttonFromTop < eagerness) {
        this.backend.loadMaterialsPage(this.backend.materialOptions.filter)
      }
    }
  }

  ngOnInit() {
    // initial loading
    setTimeout(() => {
      this.backend.loadMaterialsPage(this.backend.materialOptions.filter)
      this.backend.loadImages()
    }, 0)

    // stateful dialog: open material in modal if ID is present in current route
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

  startMaterial() {
    this.selectedMaterial = {
      name: '',
      description: '',
      imageURL: '',
      articleID: '',
      customer: '',
      state: '',
      tags: [],
    }
  }

  closeModal() {
    this.selectedMaterial = undefined
    this.router.navigate(['/materials', 'list'])
  }

  applyFilter(filter: string) {
    this.backend.materials = []
    this.backend.nextMaterialsCursor = ''
    this.backend.firstPageLoaded = false
    this.backend.materialOptions.filter = filter
    this.backend.loadMaterialsPage(this.backend.materialOptions.filter)
  }

}
