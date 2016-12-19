import React, {PropTypes, Component} from 'react';
import Place from 'material-ui/svg-icons/maps/place';

export default class MyMarker extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="hint hint--html hint--top hint--top-place">
        <Place style={{height:48, width:48}} color="#ff6161" />
        <div className="hint__content" style={{width:100}}>
         客訴地點
        </div>
      </div>
    );
  }
}