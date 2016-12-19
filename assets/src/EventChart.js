import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';
import { scaleTime } from 'd3-scale';

import EventTooltip from './EventTooltip';
import TimeAxis from './TimeAxis';

// Test data
const outageEvents = [
  {
    id: 1,
    startTime: Moment('2016-12-12 13:00:00'),
    endTime: Moment('2016-12-13 13:00:00'),
    title: "event 123"
  }, {
    id: 2,
    startTime: Moment('2016-12-13 13:00:00'),
    endTime: Moment('2016-12-14 13:00:00'),
    title: "event 456"
  }, {
    id: 3,
    startTime: Moment('2016-12-14 09:00:00'),
    endTime: Moment('2016-12-15 14:00:00'),
    title: "event ttt"
  }
];

export default class EventChart extends Component {
  
  static propTypes = {
    eventHeight : PropTypes.number,
    fontSize : PropTypes.number,
    chartWidth: PropTypes.number,
  };

  static defaultProps = {
    eventHeight : 30,
    fontSize : 18,
    chartWidth : 1024,
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: null,
      chartStartTime: Moment('2016-12-12 09:00:00'),
      chartEndTime: Moment('2016-12-16 09:00:00'),
      isDragging: false,
      mouseXPos: 0,
    };
  };

  // event action 
  handleEventClick(e, event) {
    e.stopPropagation();
    console.log('click event');
    console.log(event);
  };
  onEventMouseOver(e, event) {
    this.setState({ hover: event });
  };
  onEventMouseLeave() {
    this.setState({ hover: null });
  };

  // svg action 
  onMouseDown(e) {
    e.preventDefault();
    const x = e.pageX;
    const y = e.pageY;
    console.log(`mouse down. x=${x}, y=${y}`);
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
    console.log('mouse out');
    e.preventDefault();
    this.setState({ mouseXPos: 0, isDragging: false });
  };

  onMouseUp(e) {
    e.stopPropagation();
    const x = e.pageX;
    const y = e.pageY;
    console.log(`mouse up. x=${x}, y=${y}`);
    this.setState({ mouseXPos: 0, isDragging: false });
  };
  
   

  handleScrollWheel(e) {
    e.preventDefault();

    if (e.deltaY < 0) {
      console.log('zoom out');
      this.setState({ 
        chartStartTime: this.state.chartStartTime.add(1, 'hours'),
        chartEndTime: this.state.chartEndTime.subtract(1, 'hours'),
      });
    } else {
      console.log('zoom in');
      this.setState({ 
        chartStartTime: this.state.chartStartTime.subtract(1, 'hours'),
        chartEndTime: this.state.chartEndTime.add(1, 'hours'),
      });
    }
  };

  render() {
    // tooltip 
    const tooltipTriangleHeight = 8;
    const tooltipInfoTitleSize = 18;
    const tooltipInfoTimeSize = 14;
    const tooltipInfoHeight = tooltipInfoTitleSize + tooltipInfoTimeSize + 10;
    
    // event markers
    const timeScale = scaleTime().domain([this.state.chartStartTime, this.state.chartEndTime]).range([0, this.props.chartWidth]);
    const xTextOffset = 4;
    const yTextOffset = (this.props.eventHeight-4-this.props.fontSize)/2;
    const eventMarkers = [];
    let yPos = tooltipInfoHeight+tooltipTriangleHeight;
    let i = 0;
    let preEventEndTime = null;

    for( const event of outageEvents ) {
      // 計算 event y 軸位置 
      // 判斷 event 的時間是否有重疊，有重疊的話 event 往下擺放
      const stacked = preEventEndTime && (event.startTime-preEventEndTime <= 0) ? true : false;
      yPos = stacked ? yPos+this.props.eventHeight+10 : yPos;
      const y = yPos;

      // 計算 event x 軸位置
      const beginPos = timeScale(event.startTime);
      const endPos = timeScale(event.endTime);
      const x = beginPos;

      // 計算 event width
      const width = endPos - beginPos;

      // if event hovered, show event tooltip 
      let tooltip = null;
      if ( this.state.hover && this.state.hover.id == event.id ) {
        tooltip = (
          <EventTooltip 
            xEventPos={x}
            yEventPos={y}
            eventWidth={width}
            eventStartTime={event.startTime}
            eventEndTime={event.endTime}
            eventTitle={event.title}
            triangleHeight={tooltipTriangleHeight}
            infoTitleSize={tooltipInfoTitleSize}
            infoTimeSize={tooltipInfoTimeSize}
            infoHeight={tooltipInfoHeight}
          />
        )
      }


      eventMarkers.push(
        <g key={`event-${i}`}>
          <rect
            x={x}
            y={y}
            width={width}
            height={this.props.eventHeight}
            style={{ fill:'#c1eac6', strokeWidth:1, stroke:'#737070' }}
            onClick={e => this.handleEventClick(e, event)}
            onMouseOver={e => this.onEventMouseOver(e, event)}
            onMouseLeave={() => this.onEventMouseLeave()}
          />
          <text 
            x={x+xTextOffset}
            y={y+this.props.fontSize+yTextOffset} 
            style={{ fill:'black', fontSize:`${this.props.fontSize}px` }}
            onClick={e => this.handleEventClick(e, event)}
            onMouseOver={e => this.onEventMouseOver(e, event)}
            onMouseLeave={() => this.onEventMouseLeave()}
          >
            {event.title}
          </text>
          {tooltip}
        </g>
      );

      preEventEndTime = event.endTime;
      i += 1;
    }

    return(
      <svg 
        width={this.props.chartWidth} 
        height={yPos + this.props.eventHeight + 50 + 25} 
        style={{ background:'#333', cursor:'-webkit-grabbing' }}
        onMouseDown={e => this.onMouseDown(e)}
        onMouseMove={e => this.onMouseMove(e)}
        onMouseOut={e => this.onMouseOut(e)}
        onMouseUp={e => this.onMouseUp(e)}
        onWheel={e => this.handleScrollWheel(e)}
      >
        {eventMarkers}
        <g transform={`translate(0,${yPos + this.props.eventHeight + 50})`}>
          <TimeAxis
            scale={timeScale}
            utc={false}
            showGrid={false}
          />
        </g>
      </svg>
    )
  }
}