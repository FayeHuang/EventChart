import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';
import { scaleTime } from 'd3-scale';

import EventTooltip from './EventTooltip';
import TimeAxis from './TimeAxis';
import EventDetailDialog from './EventDetailDialog';

const yellow = "#e7d77f";
const blue = "#7ec9e9";
const green = "#72e78f";
const red  = "#f59098";

// Test data
const outageEvents = [
  {
    id: 1,
    startTime: Moment('2016-12-12 13:00:00'),
    endTime: Moment('2016-12-13 13:00:00'),
    title: "event 123",
    color: yellow,
  }, {
    id: 2,
    startTime: Moment('2016-12-13 13:00:00'),
    endTime: Moment('2016-12-14 13:00:00'),
    title: "event 456",
    color: blue,
  }, {
    id: 3,
    startTime: Moment('2016-12-14 09:00:00'),
    endTime: Moment('2016-12-15 14:00:00'),
    title: "event ttt",
    color: green,
  }, {
    id: 4,
    startTime: Moment('2016-12-15 08:00:00'),
    endTime: Moment('2016-12-15 20:00:00'),
    title: "event yyy",
    color: red,
  }, {
    id: 5,
    startTime: Moment('2016-12-15 09:00:00'),
    endTime: Moment('2016-12-16 14:00:00'),
    title: "event xxx",
    color: yellow,
  }, {
    id: 6,
    startTime: Moment('2016-12-15 14:00:00'),
    endTime: Moment('2016-12-15 21:00:00'),
    title: "event rrr",
    color: green,
  }

];

export default class EventChart extends Component {
  
  static propTypes = {
    eventHeight: PropTypes.number,
    fontSize: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    eventHeight : 30,
    fontSize : 18,
    width: 1024,
    height: 768,
  };

  constructor(props) {
    super(props);
    this.state = {
      hoverEvent: null,
      clickEvent: null,
      chartStartTime: Moment('2016-12-12 09:00:00'),
      chartEndTime: Moment('2016-12-16 09:00:00'),
      isDragging: false,
      mouseXPos: 0,
      eventDialogOpen: false,
    };
  };

  // event action 
  handleEventClick(e, event) {
    e.stopPropagation();
    this.setState({ clickEvent: event, eventDialogOpen: true });
  };
  onEventMouseOver(e, event) {
    this.setState({ hoverEvent: event });
  };
  onEventMouseLeave() {
    this.setState({ hoverEvent: null });
  };

  // svg action 
  onMouseDown(e) {
    e.preventDefault();
    const x = e.pageX;
    const y = e.pageY;
    this.setState({ mouseXPos: x, isDragging: true });
  };
  onMouseMove(e) {
    e.preventDefault();
    const x = e.pageX;
    const y = e.pageY;
    if (this.state.isDragging && (this.state.mouseXPos !== x) ) {
      if (this.state.mouseXPos < x) {
        this.setState({ 
          chartStartTime: this.state.chartStartTime.subtract(30, 'minutes'),
          chartEndTime: this.state.chartEndTime.subtract(30, 'minutes'),
          mouseXPos: x,
        });
      } else {
        this.setState({ 
          chartStartTime: this.state.chartStartTime.add(30, 'minutes'),
          chartEndTime: this.state.chartEndTime.add(30, 'minutes'),
          mouseXPos: x,
        });
      }
    }
  };
  onMouseOut(e) {
    e.preventDefault();
    this.setState({ mouseXPos: 0, isDragging: false });
  };

  onMouseUp(e) {
    e.stopPropagation();
    const x = e.pageX;
    const y = e.pageY;
    this.setState({ mouseXPos: 0, isDragging: false });
  };

  handleScrollWheel(e) {
    e.preventDefault();

    if (e.deltaY < 0) {
      this.setState({ 
        chartStartTime: this.state.chartStartTime.add(1, 'hours'),
        chartEndTime: this.state.chartEndTime.subtract(1, 'hours'),
      });
    } else {
      this.setState({ 
        chartStartTime: this.state.chartStartTime.subtract(1, 'hours'),
        chartEndTime: this.state.chartEndTime.add(1, 'hours'),
      });
    }
  };

  handleEventDialogClose() {
    this.setState({ clickEvent: null, eventDialogOpen: false });
  };

  render() {
    
    
    // event markers
    const timeScale = scaleTime().domain([this.state.chartStartTime, this.state.chartEndTime]).range([0, this.props.width]);
    const xTextOffset = 4;
    const yTextOffset = (this.props.eventHeight-4-this.props.fontSize)/2;
    const eventMarkers = [];
    let yPos = 10;
    let i = 0;
    let preEventEndTime = null;

    for( const event of outageEvents ) {
      // 計算 event y 軸位置 
      // 判斷 event 的時間是否有重疊，有重疊的話 event 往下擺放
      const stacked = preEventEndTime && (event.startTime-preEventEndTime <= 0) ? true : false;
      yPos = stacked ? yPos+this.props.eventHeight+10 : yPos;
      const y = yPos;
      event.y = y;

      // 計算 event x 軸位置
      const beginPos = timeScale(event.startTime);
      const endPos = timeScale(event.endTime);
      const x = beginPos;
      event.x = x;
      event.beginPos = beginPos;
      event.endPos = endPos;

      // 計算 event width
      const width = endPos - beginPos;
      event.width = width;

      // 計算 event text
      const textX = (beginPos>=0) ? (x+xTextOffset):(endPos>0 ? 0+xTextOffset:beginPos);
      const textY = y+this.props.fontSize+yTextOffset;

      eventMarkers.push(
        <g key={`event-${i}`}>
          <rect
            x={x}
            y={y}
            rx={4}
            ry={4}
            width={width}
            height={this.props.eventHeight}
            style={{ fill:event.color}}
            //filter="url(#filter1)"
            onClick={e => this.handleEventClick(e, event)}
            onMouseOver={e => this.onEventMouseOver(e, event)}
            onMouseLeave={() => this.onEventMouseLeave()}
          />
          <text 
            x={textX}
            y={textY} 
            style={{ fill:'#414143', fontSize:`${this.props.fontSize}px` }}
            onClick={e => this.handleEventClick(e, event)}
            onMouseOver={e => this.onEventMouseOver(e, event)}
            onMouseLeave={() => this.onEventMouseLeave()}
          >
            {event.title}
          </text>
          
        </g>
      );

      preEventEndTime = event.endTime;
      i += 1;
    }

    // tooltip 
    const tooltipInfoTitleSize = 18;
    const tooltipInfoTimeSize = 14;
    let tooltip = null;
    if ( this.state.hoverEvent ) {
      tooltip = (
        <EventTooltip 
          event={this.state.hoverEvent}
          infoTitleSize={tooltipInfoTitleSize}
          infoTimeSize={tooltipInfoTimeSize}
        />
      )
    }


    let dialog = null;
    if (this.state.eventDialogOpen && this.state.clickEvent) {
      dialog = (
        <EventDetailDialog 
          event={this.state.clickEvent}
          dialogOpen={this.state.eventDialogOpen}
          handleEventDialogClose={() => this.handleEventDialogClose() }
        />
      )
    }


    // 時間軸的高度
    const timeLineHeight = 35;
    // 與頁面滿版的高度
    const eventChartDivHeight = this.props.height - timeLineHeight;
    // 所有 event 加總的高度
    const allEventHeight = yPos + this.props.eventHeight + 10;
    // 減 10 (because stroke width ?) 避免 svg event chart overflow
    const eventChartHeight = allEventHeight > eventChartDivHeight-10 ? allEventHeight:eventChartDivHeight-10;

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
              {eventMarkers}
            </svg>
          </div>
          {/* end event chart div */}
          
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
      </div>
    )
  }
}