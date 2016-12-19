import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import EventChart from './EventChart';

export default class Main extends Component {
  
  static propTypes = {
    appBarHeight: PropTypes.number,
    toolBarHeight: PropTypes.number,
  };

  static defaultProps = {
    appBarHeight: 100,
    toolBarHeight: 100,
  };

  constructor(props) {
    super(props);
  };

  render() {
    return(
      <div>
        <div style={{
          fontSize:36,
          height: this.props.appBarHeight,
          lineHeight: '100px',
          color:'#ccc',
          verticalAlign: 'middle',
          paddingLeft: 30,
        }}>
          App Bar 
        </div>
        <div style={{
          fontSize:36,
          height: this.props.toolBarHeight,
          lineHeight: '100px',
          color:'#ccc',
          verticalAlign: 'middle',
          paddingLeft: 30,
          borderBottom:'1px solid #ccc',
        }}>
          Toolbar 
        </div>
        <h1>Timeline</h1>
        <EventChart />
      </div>
    )
  }
}