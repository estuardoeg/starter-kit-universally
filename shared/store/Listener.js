import { observable } from 'mobx';
import get from 'lodash/get';

export default class Listener {

  @observable
  timelines = new Map();

  get data() {
    return this.timelines.entries();
  }

  get list() {
    return this.timelines.keys();
  }

  get values() {
    return this.timelines.values();
  }

  active(id) {
    // If no id specified, let's return the first timeline we have
    if (!id && this.timelines.size > 0) {
      return this.values[0];
    }

    if (this.timelines.has(id)) {
      return this.timelines.get(id);
    }

    return [];
  }

  add(timeline) {
    const id = get(timeline, 'vars.id');

    if (!id) {
      return console.warn('You need to define an id to the timeline');
    }

    // Hot reload and set just breaks Chrome
    if (!this.timelines.has(id)) {
      this.timelines.set(id, timeline);
    }
  }

  clear(timeline) {
    // console.log('-clear', timeline);

    const id = get(timeline, 'vars.id');

    if (!id) {
      return console.warn('No id define for this timeline');
    }

    if (this.timelines.has(id)) {
      this.timelines.delete(id);
    }
  }
}
