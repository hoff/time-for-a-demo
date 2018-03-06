// ng
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material'
import { Router } from '@angular/router'

// rx
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'
import { delay } from 'rxjs/operators/delay'

// app
import { environment } from '../environments/environment'

/**
 * This service is responsive for communicating
 * with the app's RESTful backend service
 */
@Injectable()
export class BackendService {

  // app environment
  environment
  authenticated = false
  token
  assetsURL = environment.assetsURL
  backendHost = environment.backendHost
  apiURL = this.backendHost + '/api/'
  backendDelay = environment.backendDelay

  // content state
  materials = []
  images = []
  moreMaterials = false
  materialsLoading = false
  nextMaterialsCursor: string
  firstPageLoaded = false
  flags = { infinityScroll: true }
  materialOptions = {
    filter: 'All',
    filters: [
      'All',
      'Scanning',
      'Image Processing',
      'Shading',
      'Completed',
    ],
    states: [
      'New',
      'Scanning',
      'Image Processing',
      'Shading',
      'Completed',
    ],
    customers: [
      'JOOP!',
      'Rolf Benz',
    ],
    allowAdding: false
  }

  constructor(
    public http: HttpClient,
    public snackBar: MatSnackBar,
    public router: Router,
  ) {
    this.environment = environment
    this.authenticate(localStorage.getItem('token'))
  }

  /**
   * loads the first or next results page from matrial, with a given filter
   */
  loadMaterialsPage(filter: string) {
    if (this.materialsLoading || (!this.moreMaterials && this.firstPageLoaded )) { return }
    this.materialsLoading = true
    this.http.get(this.apiURL + 'materials', {params: {filter: filter, cursor: this.nextMaterialsCursor ? this.nextMaterialsCursor : '' }})
      .pipe(delay(this.backendDelay))
      .subscribe((reply: any) => {
        this.materials = this.materials.concat(reply.data)
        this.moreMaterials = reply.more
        this.nextMaterialsCursor = reply.next_cursor
        this.materialsLoading = false
        this.firstPageLoaded = true
      })
  }

  /**
   * load a material from a givenID
   */
  loadMaterialById(id) {
    return this.http.get(this.apiURL + 'material?id=' + id)
      .pipe(delay(this.backendDelay))
  }

  /**
   * sends an update-material request to the backend
   */
  saveMaterial(material) {
    const materialData = this.materialToObject(material)
    this.http.post(this.apiURL + 'materials', materialData)
    .pipe(delay(this.backendDelay))
    .subscribe(reply => {
      this.snackBar.open('The material has been saved.', '', {duration: 2000})
    })
  }

  /**
   * sends a create-material request to the backend
   */
  createMaterial(material) {
    const materialData = this.materialToObject(material)
    this.http.put(this.apiURL + 'materials', materialData)
    .pipe(delay(this.backendDelay))
    .subscribe((reply: any) => {
      this.snackBar.open('The material has been created.', '', {duration: 2000})
    })
  }

  /**
   * loads user images
   */
  loadImages() {
    this.http.get(this.apiURL + 'images')
      .pipe(delay(this.backendDelay))
      .subscribe((reply: any) => {
        this.images = reply
      })
  }

  /**
   * converts a material object to a data object
   * for backend communication
   */
  materialToObject(material) {
    return {
      id: material.id,
      name: material.name,
      description: material.description,
      imageURL: material.imageURL,
      state: material.state,
      articleID: material.articleID,
      customer: material.customer,
      tags: material.tags,
    }
  }

  // image upload
  uploadFile(file: File): Observable<any> {
    return Observable.create(progressStream => {

      const formData: FormData = new FormData()
      const xhr: XMLHttpRequest = new XMLHttpRequest()

      // uploads[] is how we pick things up in the backend
      formData.append('uploads[]', file, file.name)

      // listen to server response
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const imageInfo = JSON.parse(xhr.response)
            progressStream.next(100)
            progressStream.complete()
          } else {
            progressStream.error(xhr.response)
          }
        }
      }
      // request an upload URL, then kick off upload
      this.http.get(this.backendHost + '/api/image/upload-url').subscribe((data: any) => {
        xhr.open('POST', data.url, true)
        xhr.send(formData)
      })
    })
  }

  // move to ui
  placeholderImg() {
    return this.assetsURL + 'black_placeholder.jpg'
  }

  /**
   * simple authentication
   */
  authenticate(token: string) {
    if (!token) { return }
    const hash = '-1884257769'
    this.authenticated = this.hashCode2(token) === hash
    if (this.authenticated) {
      localStorage.setItem('token', token)
      // this.router.navigate(['/materials/list'])
    }
  }

  /**
   * logout for simple authentication
   */
  logout() {
    localStorage.removeItem('token')
    this.authenticated = false
  }

  /**
   * simple hashing function
   */
 hashCode2(str) {
    let hash = 0
    if (str.length === 0) { return hash }
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash + ''
  }

}
