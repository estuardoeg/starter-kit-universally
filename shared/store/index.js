import { observable } from 'mobx';

import Network from './Network';
import Planets from './Planets';

class Gsap {

  @observable
  toggle = false;
}

export default class Store {

  constructor(state = {}) {
    this.gsap = new Gsap(state);
    this.network = new Network(state);
    this.planets = new Planets(state, this.network);
  }
}
