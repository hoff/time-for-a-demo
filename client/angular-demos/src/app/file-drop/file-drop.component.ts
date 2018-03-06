// ng
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core'
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser'

// rx
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/take'

// ink
import { BackendService } from '../backend.service'


interface UploadObject {
  filename: string
  status: string
  percent: number
  preview: any
}

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
})
export class FileDropComponent {

  @Input('size') size: number
  @ViewChild('fileinput') fileinput: ElementRef

  uploads: any[] = []

  constructor(
    private backend: BackendService,
    private sanitizer: DomSanitizer,
  ) { }

  /** pass on the click to the native input type file */
  clickFileinput() {
    this.fileinput.nativeElement.click()
  }
  /** on classic file click and drop! */
  fileinputChange($event) {

    let files: any[]
    if ($event.dataTransfer) {
      files = $event.dataTransfer.files
    } else {
      files = $event.target.files
    }
    new Observable(stream => {
      for (const file of files) {

        const uploadObject: UploadObject = {
          filename: file.name,
          status: 'created',
          percent: 0,
          preview: ''
        }
        this.uploads.push(uploadObject)

        // attach a preview callback
        const reader = new FileReader()
        reader.onload = (event: any) => {
          uploadObject.preview = this.sanitizer.bypassSecurityTrustStyle('url(' + event.target.result + ')')
          console.log('preview ready', uploadObject.preview)
        }
        reader.readAsDataURL(file)

        // upload the file, and listen to news
        this.backend.uploadFile(file).subscribe(
          (progress) => {
            console.log('fd progress', progress)
            uploadObject.percent = progress
          }, (error) => {
            console.log('error in upload progress', error)
            uploadObject.status = 'error'
          }, () => {
            console.log('fd complete')
            uploadObject.status = 'uploaded'
            stream.next('uploaded something!')
          })
      }
    }).take(files.length).subscribe(result => {
      console.log('something is done :)')
    }, (error) => {
      console.log('something went wront')
    }, () => {
      console.log('all the things are done!')
    })
  }

  /** make the element a drop target */
  onDragOver($event) {
    $event.preventDefault()
    $event.stopPropagation()
  }

  /** start file upload on drop */
  onDrop($event) {
    $event.preventDefault()
    $event.stopPropagation()
    this.fileinputChange($event)
  }

}
