import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import config from 'utils/config';

const showGsapTools = process.env.GSAP_DEVTOOLS === 'true' || config('gsapDevtools');

class GsapLib extends PureComponent {

  render() {
    return (
      <div>
        <Helmet>
          <script src="/gsapDevTools.js" />
        </Helmet>
      </div>
    );
  }
}

export default showGsapTools ? GsapLib : (() => null);
