import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import GsapTools from 'gsap-tools'; // eslint-disable-line

import Hero from './components/hero';

export default class GsapDemo extends PureComponent {

  render() {
    return (
      <div>
        <Helmet title="Gsap tools demo" />
        <Hero>
          <GsapTools isVisible noPanel />
        </Hero>
      </div>
    );
  }
}
