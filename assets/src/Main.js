import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import EventChart from './EventChart';

export default class Main extends Component {
  
  static propTypes = {
    appBarHeight: PropTypes.number,
    toolBarHeight: PropTypes.number,
    //
    chartHeightMin: PropTypes.number,
    chartWidthMin: PropTypes.number,
  };

  static defaultProps = {
    appBarHeight: 100,
    toolBarHeight: 100,
    chartHeightMin: 300,
    chartWidthMin: 768,
  };

  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      chartWidth: window.innerWidth,
      chartHeight: window.innerHeight-this.props.appBarHeight-this.props.toolBarHeight,
    };
  };

  handleResize = () => {
    const {chartWidthMin, chartHeightMin, appBarHeight, toolBarHeight} = this.props;
    this.setState({ 
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      chartWidth: window.innerWidth > chartWidthMin ? 
        window.innerWidth : chartWidthMin,
      chartHeight: (window.innerHeight - appBarHeight - toolBarHeight) > chartHeightMin ?
        (window.innerHeight-appBarHeight-toolBarHeight) : chartHeightMin,
    });
    console.log(window.innerHeight);
    console.log(this.props.chartHeight);
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  };


  render() {
    return(
      <MuiThemeProvider>
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

          <EventChart 
            width={this.state.chartWidth}
            height={this.state.chartHeight-10}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}