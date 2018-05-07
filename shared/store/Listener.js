import { observable } from 'mobx';
import get from 'lodash/get';

export default class Listener {

  @observable
  timelines = new Map();

  get keys() {
    return this.timelines.keys();
  }

  get values() {
    return this.timelines.values();
  }

  active(id) {
    // If no id specified and that we have timeline saved
    // let's return the first one we have
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
      return console.warn('No id defined for the timeline. e.g. TimelineLite({ id: ’myTimeline’ })');
    }

    if (!this.timelines.has(id)) {
      this.timelines.set(id, timeline);
    }
  }

  clear(timeline) {
    const id = get(timeline, 'vars.id');

    if (!id) {
      return console.warn('No id defined for the timeline. e.g. TimelineLite({ id: ’myTimeline’ })');
    }

    if (this.timelines.has(id)) {
      this.timelines.delete(id);
    }
  }
}
