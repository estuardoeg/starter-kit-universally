import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';

import Segment from 'components/segment';
import Button from 'components/button';
import GsapTools from 'components/gsaptools';

import Heading from './components/heading';
import Intro from './components/intro';
import Cube from './components/cube';

export default class About extends PureComponent {

  state = {
    toggleHeading: false,
    toggleIntro: false,
    moveCube: false,
  }

  componentDidMount() {
    this.setState({ // eslint-disable-line
      toggleHeading: true,
      toggleIntro: true,
    });
  }

  handleIntro = () => {
    this.setState({
      toggleIntro: !this.state.toggleIntro,
    });
  }

  handleCube = () => {
    this.setState({
      moveCube: !this.state.moveCube,
    });
  }

  handleHeading = () => {
    this.setState({
      toggleHeading: !this.state.toggleHeading,
    });
  }

  render() {
    const { toggleIntro, moveCube, toggleHeading } = this.state;

    return (
      <div>
        <Helmet title="About" />

        <GsapTools>
          <Heading
            copy="About us."
            heading={toggleHeading}
          />
        </GsapTools>

        <GsapTools>
          <Intro
            heading="Discover what drove us here"
            copy="This is a copy for the about route. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Nulla malesuada interdum nibh. In hendrerit
            tellus nec enim convallis fringilla nec ut erat. Proin egestas
            erat vel scelerisque finibus."
            intro={toggleIntro}
          />
        </GsapTools>

        <GsapTools>
          <Cube move={moveCube} />
        </GsapTools>

        <Segment>
          <Button onClick={this.handleHeading}>Toggle heading</Button>
          <Button onClick={this.handleIntro}>Toggle intro</Button>
          <Button onClick={this.handleCube}>Move cube</Button>
        </Segment>
      </div>
    );
  }
}
