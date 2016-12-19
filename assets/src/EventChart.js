import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';
import { scaleTime } from 'd3-scale';

import EventTooltip from './EventTooltip';
import TimeAxis from './TimeAxis';
import EventDetailDialog from './EventDetailDialog';

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
  }, {
    id: 4,
    startTime: Moment('2016-12-15 08:00:00'),
    endTime: Moment('2016-12-15 20:00:00'),
    title: "event yyy"
  }, {
    id: 5,
    startTime: Moment('2016-12-15 09:00:00'),
    endTime: Moment('2016-12-16 14:00:00'),
    title: "event xxx"
  }, {
    id: 6,
    startTime: Moment('2016-12-15 14:00:00'),
    endTime: Moment('2016-12-15 21:00:00'),
    title: "event rrr"
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

  handleEventDialogClose() {
    this.setState({ clickEvent: null, eventDialogOpen: false });
  };

  render() {
    // tooltip 
    const tooltipTriangleHeight = 8;
    const tooltipInfoTitleSize = 18;
    const tooltipInfoTimeSize = 14;
    const tooltipInfoHeight = tooltipInfoTitleSize + tooltipInfoTimeSize + 10;
    
    // event markers
    const timeScale = scaleTime().domain([this.state.chartStartTime, this.state.chartEndTime]).range([0, this.props.width]);
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
      if ( this.state.hoverEvent && this.state.hoverEvent.id == event.id ) {
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
    const timeLineHeight = 25;
    // 與頁面滿版的高度
    const eventChartDivHeight = this.props.height - timeLineHeight;
    // 所有 event 加總的高度
    const allEventHeight = yPos + this.props.eventHeight + 10;
    // 減 10 (because stroke width ?) 避免 svg event chart overflow
    const eventChartHeight = allEventHeight > eventChartDivHeight-10 ? allEventHeight:eventChartDivHeight-10;

    return(
      <div>
        <div style={{
          width:this.props.width, 
          height:eventChartDivHeight, 
          overflowX:'hidden', 
          overflowY:'scroll',
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
            {eventMarkers}
          </svg>
        </div>
        <svg width={this.props.width} height={timeLineHeight}>
          <line x1={0} y1={0} x2={this.props.width} y2={0} style={{stroke:'#ccc', strokeWidth:2}} />
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