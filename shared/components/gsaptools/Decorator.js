import React from 'react';

import Wrapper from './Wrapper';
import getDisplayName from './getDisplayName';

export default (options) => {
  const wrap = (Child, opts) => {
    const wrapper = props => (
      <Wrapper {...opts}>
        <Child {...props} />
      </Wrapper>
    );

    wrapper.displayName = getDisplayName(Child);

    return wrapper;
  };

  if (typeof options === 'function') {
    return wrap(options, {});
  }

  return Child => wrap(Child, options);
};
