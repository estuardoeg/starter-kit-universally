import Network from './Network';
import Planets from './Planets';
import Listener from './Listener';

export default class Store {

  constructor(state = {}) {
    this.network = new Network(state);
    this.planets = new Planets(state, this.network);
    this.listener = new Listener(state);
  }
}
