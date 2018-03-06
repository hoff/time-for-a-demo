import { Injectable } from '@angular/core';

@Injectable()
export class StateService {

  flags = {
    infinityScroll: true
  }

  materials = {
    // current filter
    filter: 'All',
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
    ]
  }

  constructor() { }

}
