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
            backgroundColor: '#333',
          }}>
            App Bar 
          </div>

          <div style={{
            fontSize:36,
            //height: this.props.toolBarHeight,
            //lineHeight: '100px',
            color:'#ccc',
            verticalAlign: 'middle',
            paddingLeft: 30,
            backgroundColor: '#333',
          }}>
            <div style={{display:'inline-block',paddingRight:20}}>
              <div style={{height:20, width:30, backgroundColor:'#e7d77f', display:'inline-block'}}></div>
              <div style={{height:20, width:30, backgroundColor:'#d3be72', display:'inline-block'}}></div>
              <div style={{height:20, width:30, backgroundColor:'#9a8858', display:'inline-block'}}></div>
              <div style={{height:20, width:30, backgroundColor:'#5f635d', display:'inline-block'}}></div>
            </div>
            <div style={{display:'inline-block',paddingRight:20}}>
              <div style={{height:20, width:30, backgroundColor:'#7ec9e9', display:'inline-block'}}></div>
              <div style={{height:20, width:30, backgroundColor:'#67bbe0', display:'inline-block'}}></div>
              <div style={{height:20, width:30, backgroundColor:'#3d88b2', display:'inline-block'}}></div>
              <div style={{height:20, width:30, backgroundColor:'#2a5e84', display:'inline-block'}}></div>
            </div>
            <div style={{display:'inline-block',paddingRight:20}}>
              <div style={{height:20, width:30, backgroundColor:'#72e78f', display:'inline-block'}}></div>
              <div style={{height:20, width:30, backgroundColor:'#51bd84', display:'inline-block'}}></div>
              <div style={{height:20, width:30, backgroundColor:'#3b9166', display:'inline-block'}}></div>
              <div style={{height:20, width:30, backgroundColor:'#346b65', display:'inline-block'}}></div>
            </div>
            <div style={{display:'inline-block',paddingRight:20}}>
              <div style={{height:20, width:30, backgroundColor:'#f59098', display:'inline-block'}}></div>
              <div style={{height:20, width:30, backgroundColor:'#e2808a', display:'inline-block'}}></div>
              <div style={{height:20, width:30, backgroundColor:'#bd6470', display:'inline-block'}}></div>
              <div style={{height:20, width:30, backgroundColor:'#a0566c', display:'inline-block'}}></div>
            </div>
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