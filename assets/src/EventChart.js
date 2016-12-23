import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';
import { scaleTime } from 'd3-scale';
import { connect } from 'react-redux';

import EventTooltip from './EventTooltip';
import EventDetailDialog from './EventDetailDialog';
import Events from './Events';
import Timeline from './Timeline';

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
    width: PropTypes.number,
    height: PropTypes.number,
    chartYBeginPos: PropTypes.number,
    
    // redux props
    mouseXPos: PropTypes.number,
    chartStartTime: PropTypes.object,
    chartEndTime: PropTypes.object,
    hoverEvent: PropTypes.object,
    clickEvent: PropTypes.object,
    eventDialogOpen: PropTypes.boolean,
    windowYOffset: PropTypes.number,
  };

  static defaultProps = {
    width: 1024,
    height: 768,
    chartYBeginPos: 200,
  };

  constructor(props) {
    super(props);
  };

  // event action 
  handleEventClick(e, event) {
    e.stopPropagation();
    this.props.dispatch( eventDialogOpen(event) );
  };
  onEventMouseOver(e, event) {
    this.props.dispatch( eventHover(event) );
  };
  onEventMouseLeave() {
    this.props.dispatch( eventHoverOut() );
  };
  handleEventDialogClose() {
    this.props.dispatch( eventDialogClose() );
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
      this.props.dispatch( 
        timelineZooming(
          this.props.chartStartTime.add(1, 'hours'), 
          this.props.chartEndTime.subtract(1, 'hours')
      ));
    } else {
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
    const unplannedEventsDivHeight = (this.props.height-timeLineHeight)*0.7;
    // 計畫性事件與頁面滿版的高度
    const plannedEventsDivHeight = (this.props.height-timeLineHeight)*0.3;
    
    const timeScale = scaleTime().domain([this.props.chartStartTime, this.props.chartEndTime]).range([0, this.props.width]);
    
    const timeline = (
      <Timeline 
        top={0+unplannedEventsDivHeight}
        width={this.props.width}
        height={timeLineHeight}
        timeScale={timeScale}
      />      
    );
    
    const unplannedEvents = (
      <Events 
        data={unplannedEventsData}
        timeScale={timeScale}
        width={this.props.width}
        height={unplannedEventsDivHeight}
        top={0}
        handleEventClick={(e, event) => this.handleEventClick(e, event)}
        onEventMouseOver={(e, event) => this.onEventMouseOver(e, event)}
        onEventMouseLeave={() => this.onEventMouseLeave()}
      /> );
    const plannedEvents = (
      <Events 
        data={plannedEventsData}
        timeScale={timeScale}
        width={this.props.width}
        height={plannedEventsDivHeight}
        top={0+unplannedEventsDivHeight+timeLineHeight}
        handleEventClick={(e, event) => this.handleEventClick(e, event)}
        onEventMouseOver={(e, event) => this.onEventMouseOver(e, event)}
        onEventMouseLeave={() => this.onEventMouseLeave()}
      /> );
    
    // tooltip 
    let tooltip = null;
    if ( this.props.hoverEvent ) {
      tooltip = (
        <EventTooltip 
          event={this.props.hoverEvent}
          chartWidth={this.props.width}
          chartHeight={this.props.height}
          chartYBeginPos={this.props.chartYBeginPos}
          windowYOffset={this.props.windowYOffset}
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
      <div 
        style={{
          width:this.props.width,
          height:this.props.height,
          position:'relative',
          cursor:'-webkit-grabbing',
        }}
        onMouseDown={e => this.onMouseDown(e)}
        onMouseMove={e => this.onMouseMove(e)}
        onMouseOut={e => this.onMouseOut(e)}
        onMouseUp={e => this.onMouseUp(e)}
        onWheel={e => this.handleScrollWheel(e)}
      >
        {tooltip}
        {unplannedEvents}
        {timeline}
        {plannedEvents}
        {dialog}
        {/*
        <pre>
          redux state = { JSON.stringify(this.props.eventChart, null, 2) }
        </pre>
        */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { page, eventChart } = state
  return {
    // event chart
    mouseXPos: eventChart.mouseXPos,
    chartStartTime: eventChart.chartStartTime,
    chartEndTime: eventChart.chartEndTime,
    hoverEvent: eventChart.hoverEvent,
    clickEvent: eventChart.clickEvent,
    eventDialogOpen: eventChart.eventDialogOpen,
    // window
    windowYOffset: page.windowYOffset,
    // debug
    eventChart: eventChart,
  }
}

export default connect(mapStateToProps)(EventChart)