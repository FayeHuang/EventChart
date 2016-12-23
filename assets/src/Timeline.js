import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';

import TimeAxis from './TimeAxis';

export default class Timeline extends Component {
  
  static propTypes = {
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    timeScale: PropTypes.func.isRequired,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
  };

  render() {
  	return(
  	  <div style={{
        width:this.props.width, 
        height:this.props.height, 
        position:'absolute',
        top:this.props.top,
        left:0,
      }}>
        <svg width={this.props.width} height={this.props.height}>
          <line x1={0} y1={0} x2={this.props.width} y2={0} style={{stroke:'#8b8b8b', strokeWidth:4}} />
          <TimeAxis
            scale={this.props.timeScale}
            utc={false}
            showGrid={false}
          />
        </svg>
      </div>
  	);
  };

}