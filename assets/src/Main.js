import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';

import EventChart from './EventChart';
import {windowResize, windowScroll} from './actions';

class Main extends Component {
  
  static propTypes = {
    // normal props
    appBarHeight: PropTypes.number,
    toolBarHeight: PropTypes.number,
    chartHeightMin: PropTypes.number,
    chartWidthMin: PropTypes.number,
    // redux props
    windowWidth: PropTypes.number,
    windowHeight: PropTypes.number,
  };

  static defaultProps = {
    appBarHeight: 64,
    toolBarHeight: 100,
    chartHeightMin: 300,
    chartWidthMin: 768,
  };

  constructor(props) {
    super(props);
    this.state = {
      navOpen: false,
    }
  };

  handleResize = () => {
    this.props.dispatch( windowResize(window.innerWidth, window.innerHeight) ) ;
  };

  handleScroll = () => {
    this.props.dispatch( windowScroll(window.pageXOffset, window.pageYOffset) );
  };

  handleNavOpen() {
    this.setState({navOpen: !this.state.navOpen});
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener("scroll", this.handleScroll);
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.addEventListener("scroll", this.handleScroll);
  };

  render() {
    const {windowWidth, windowHeight, chartHeightMin, chartWidthMin, appBarHeight, toolBarHeight} = this.props;
    const chartWidth = windowWidth > chartWidthMin ? windowWidth:chartWidthMin;
    const chartHeight = (windowHeight-appBarHeight-toolBarHeight) > chartHeightMin ?
        (windowHeight-appBarHeight-toolBarHeight) : chartHeightMin;


    return(
      <MuiThemeProvider>
        <div>
          <AppBar
            title="AppBar"
            onLeftIconButtonTouchTap={() => this.handleNavOpen()}
            style={{backgroundColor:'#616161', color:'#ccc'}}
          />

          <div style={{
            fontSize:36,
            height: this.props.toolBarHeight,
            lineHeight: '100px',
            color:'#ccc',
            verticalAlign: 'middle',
            paddingLeft: 30,
            backgroundColor: '#616161',
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
            width={chartWidth}
            height={chartHeight-10}
            chartYBeginPos={this.props.appBarHeight+this.props.toolBarHeight}
          />

          <Drawer open={this.state.navOpen} width={200}>
            <AppBar 
              title="AppBar" 
              onLeftIconButtonTouchTap={() => this.handleNavOpen()} 
              style={{backgroundColor:'#616161', color:'#ccc'}}
            />
            <MenuItem>Menu Item</MenuItem>
            <MenuItem>Menu Item 2</MenuItem>
          </Drawer>
        </div>
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps(state) {
  const { page } = state
  return {
    windowWidth: page.windowWidth,
    windowHeight: page.windowHeight,
  }
}

export default connect(mapStateToProps)(Main)