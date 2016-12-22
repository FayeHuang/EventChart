import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';
import { scaleTime } from 'd3-scale';
import { connect } from 'react-redux';

import EventTooltip from './EventTooltip';
import TimeAxis from './TimeAxis';
import EventDetailDialog from './EventDetailDialog';
import Events from './Events';

import {unplannedEventsData, plannedEventsData} from './data';

import {
  timelineStartDrag, 
  timelineStopDrag, 
  timelineDragging, 
  timelineZooming,
  eventHover,
  eventHoverOut,
  eventDialogOpen,
  eventDialogClose
} from './actions';

class EventChart extends Component {
  
  static propTypes = {
    // normal props
    eventHeight: PropTypes.number,
    fontSize: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    // redux props
    mouseXPos: PropTypes.number,
    chartStartTime: PropTypes.object,
    chartEndTime: PropTypes.object,
    hoverEvent: PropTypes.object,
    clickEvent: PropTypes.object,
    eventDialogOpen: PropTypes.func,
  };

  static defaultProps = {
    eventHeight : 30,
    fontSize : 18,
    width: 1024,
    height: 768,
  };

  constructor(props) {
    super(props);
  };

  // event action 
  handleEventClick(e, event) {
    e.stopPropagation();
    console.log(event);
    this.props.dispatch( eventDialogOpen(event) );
    // this.setState({ clickEvent: event, eventDialogOpen: true });
  };
  onEventMouseOver(e, event) {
    this.props.dispatch( eventHover(event) );
    // this.setState({ hoverEvent: event });
  };
  onEventMouseLeave() {
    this.props.dispatch( eventHoverOut() );
    // this.setState({ hoverEvent: null });
  };
  handleEventDialogClose() {
    this.props.dispatch( eventDialogClose() );
    // this.setState({ clickEvent: null, eventDialogOpen: false });
  };

  // timeline dragging, change time range
  onMouseDown(e) {
    e.preventDefault();
    this.props.dispatch( timelineStartDrag(e.pageX) );
  };
  onMouseMove(e) {
    e.preventDefault();
    if (this.props.mouseXPos >= 0 && (this.props.mouseXPos !== e.pageX) ) {
      if (this.props.mouseXPos < e.pageX) {
        this.props.dispatch( 
          timelineDragging(
            e.pageX, 
            this.props.chartStartTime.subtract(30, 'minutes'), 
            this.props.chartEndTime.subtract(30, 'minutes')
        ));
      } else {
        this.props.dispatch( 
          timelineDragging(
            e.pageX, 
            this.props.chartStartTime.add(30, 'minutes'), 
            this.props.chartEndTime.add(30, 'minutes')
        ));
      }
    }
  };
  onMouseOut(e) {
    e.preventDefault();
    this.props.dispatch( timelineStopDrag() );
  };
  onMouseUp(e) {
    e.stopPropagation();
    this.props.dispatch( timelineStopDrag() );
  };

  // timeline zooming, change time range
  handleScrollWheel(e) {
    e.preventDefault();
    if (e.deltaY < 0) {
      console.log('zoom in');
      this.props.dispatch( 
        timelineZooming(
          this.props.chartStartTime.add(1, 'hours'), 
          this.props.chartEndTime.subtract(1, 'hours')
      ));
    } else {
      console.log('zoom out');
      this.props.dispatch( 
        timelineZooming(
          this.props.chartStartTime.subtract(1, 'hours'), 
          this.props.chartEndTime.add(1, 'hours')
      ));
    }
  };

  render() {
    // 時間軸的高度
    const timeLineHeight = 35;
    // 非計畫性事件與頁面滿版的高度
    const eventChartDivHeight = (this.props.height-timeLineHeight)*0.6;
    // 計畫性事件與頁面滿版的高度
    const stateChartDivHeight = (this.props.height-timeLineHeight)*0.4;
    
    // 所有 event 加總的高度
    // const allEventHeight = yPos + this.props.eventHeight + 10;
    // 減 10 (because stroke width ?) 避免 svg event chart overflow
    // const eventChartHeight = allEventHeight > eventChartDivHeight-10 ? allEventHeight:eventChartDivHeight-10;
    const eventChartHeight = eventChartDivHeight-10;

    
    const timeScale = scaleTime().domain([this.props.chartStartTime, this.props.chartEndTime]).range([0, this.props.width]);
    const unplannedEvents = (
      <Events 
        data={unplannedEventsData}
        timeScale={timeScale}
        yBeginPos={0}
        handleEventClick={(e, event) => this.handleEventClick(e, event)}
        onEventMouseOver={(e, event) => this.onEventMouseOver(e, event)}
        onEventMouseLeave={() => this.onEventMouseLeave()}
      /> );
    const plannedEvents = (
      <Events 
        data={plannedEventsData}
        timeScale={timeScale}
        yBeginPos={0+eventChartDivHeight+timeLineHeight}
        handleEventClick={(e, event) => this.handleEventClick(e, event)}
        onEventMouseOver={(e, event) => this.onEventMouseOver(e, event)}
        onEventMouseLeave={() => this.onEventMouseLeave()}
      /> );
    
    // tooltip 
    const tooltipInfoTitleSize = 18;
    const tooltipInfoTimeSize = 14;
    let tooltip = null;
    if ( this.props.hoverEvent ) {
      tooltip = (
        <EventTooltip 
          event={this.props.hoverEvent}
          infoTitleSize={tooltipInfoTitleSize}
          infoTimeSize={tooltipInfoTimeSize}
        />
      )
    }

    let dialog = null;
    if (this.props.eventDialogOpen && this.props.clickEvent) {
      dialog = (
        <EventDetailDialog 
          event={this.props.clickEvent}
          dialogOpen={this.props.eventDialogOpen}
          handleEventDialogClose={() => this.handleEventDialogClose() }
        />
      )
    }


    

    


    return(
      <div>
        <div 
          style={{
            width:this.props.width,
            height:eventChartDivHeight,
            position:'relative'
          }}>
          
          {/* tooltip div */}
          <div style={{width:this.props.width,height:eventChartDivHeight,position:'absolute',top:0,left:0}}>
            {tooltip}
          </div>
          {/* end tooltip div */}


          {/* event chart div */}
          <div style={{
            width:this.props.width, 
            height:eventChartDivHeight, 
            overflowX:'hidden', 
            overflowY:'auto',
            position:'absolute',
            top:0,
            left:0,
          }}>
            <svg 
              width={this.props.width} 
              height={eventChartHeight} 
              style={{ cursor:'-webkit-grabbing' }}
              onMouseDown={e => this.onMouseDown(e)}
              onMouseMove={e => this.onMouseMove(e)}
              onMouseOut={e => this.onMouseOut(e)}
              onMouseUp={e => this.onMouseUp(e)}
              onWheel={e => this.handleScrollWheel(e)}
            >
              <defs>
                <filter id="filter1" x="0" y="0" width="200%" height="200%">
                  <feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
                  <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
                  <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                </filter>
              </defs>
              {unplannedEvents}
            </svg>
          </div>
          {/* end event chart div */}

          {/* state chart div */}
          <div style={{
            width:this.props.width, 
            height:stateChartDivHeight, 
            overflowX:'hidden', 
            overflowY:'auto',
            position:'absolute',
            top:0+eventChartDivHeight+timeLineHeight,
            left:0,
          }}>
            <svg 
              width={this.props.width} 
              height={stateChartDivHeight-10} 
              style={{ cursor:'-webkit-grabbing' }}
              onMouseDown={e => this.onMouseDown(e)}
              onMouseMove={e => this.onMouseMove(e)}
              onMouseOut={e => this.onMouseOut(e)}
              onMouseUp={e => this.onMouseUp(e)}
              onWheel={e => this.handleScrollWheel(e)}
            >
              {plannedEvents}
            </svg>
          </div>
          {/* end state chart div */}
        </div>
        <svg width={this.props.width} height={timeLineHeight}
          style={{ cursor:'-webkit-grabbing' }}
          onMouseDown={e => this.onMouseDown(e)}
          onMouseMove={e => this.onMouseMove(e)}
          onMouseOut={e => this.onMouseOut(e)}
          onMouseUp={e => this.onMouseUp(e)}
          onWheel={e => this.handleScrollWheel(e)}
        >
          <line x1={0} y1={0} x2={this.props.width} y2={0} style={{stroke:'#8b8b8b', strokeWidth:4}} />
          <TimeAxis
            scale={timeScale}
            utc={false}
            showGrid={false}
          />
        </svg>
        {dialog}
        {/*
        <pre>
        redux state = { JSON.stringify(this.props.eventChart, null, 2) }
        </pre>
        */}
        
      </div>

    )
  }
}

function mapStateToProps(state) {
  const { eventChart } = state
  return {
    mouseXPos: eventChart.mouseXPos,
    chartStartTime: eventChart.chartStartTime,
    chartEndTime: eventChart.chartEndTime,
    hoverEvent: eventChart.hoverEvent,
    clickEvent: eventChart.clickEvent,
    eventDialogOpen: eventChart.eventDialogOpen,
    eventChart: eventChart,
  }
}

export default connect(mapStateToProps)(EventChart)