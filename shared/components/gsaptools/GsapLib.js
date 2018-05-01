import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Helmet from 'react-helmet';
import config from 'utils/config';

import s from './GsapLib.scss';

class GsapLib extends PureComponent {

  static propTypes = {
    noPanel: PropTypes.bool,
  }

  static defaultProps = {
    noPanel: true,
  }

  onToggleGsapTools = () => {
    console.log('this.props', this.props);
    this.props.index.toggleGsapTools = !this.props.index.toggleGsapTools;
  }

  render() {
    const { noPanel, index } = this.props;
    const { toggleGsapTools } = index;

    return (
      <div>
        <Helmet>
          <script src="/gsapDevTools.js" />
        </Helmet>

        {!noPanel && (
          <button className={s(s.gsap, { toggleGsapTools })} onClick={this.onToggleGsapTools}>
            <svg className={s.gsap__svg} width="14px" height="14px" viewBox="0 0 14 14">
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <rect x="0" y="0" width="2" height="14" />
                <rect x="4" y="0" width="2" height="14" />
                <rect x="8" y="0" width="2" height="14" />
                <rect x="12" y="0" width="2" height="14" />
              </g>
            </svg>
          </button>
        )}
      </div>
    );
  }
}

export default inject('index')(observer(GsapLib));
