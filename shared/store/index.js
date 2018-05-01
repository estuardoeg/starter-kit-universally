import { observable } from 'mobx';

import Network from './Network';
import Planets from './Planets';

export default class Store {

  constructor(state = {}) {
    this.index = state;
    this.network = new Network(state);
    this.planets = new Planets(state, this.network);
  }

  // Show or hide the GSAP devtools for wrapped components
  @observable
  toggleGsapTools = false;
}
