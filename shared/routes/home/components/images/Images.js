import React, { PureComponent } from 'react';

import s from './Images.scss';

export default class Images extends PureComponent {

  render() {
    return (
      <div className={s.images}>
        <h1>Images</h1>

        <div className={s.images__png} />
        <div className={s.images__svg} />
      </div>
    );
  }
}
