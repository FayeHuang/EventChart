import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';

export default class Events extends Component {
  
  static propTypes = {
    data: PropTypes.array.isRequired,
    timeScale: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    handleEventClick: PropTypes.func.isRequired,
    onEventMouseOver: PropTypes.func.isRequired,
    onEventMouseLeave: PropTypes.func.isRequired,
    //
    eventHeight: PropTypes.number,
    fontSize: PropTypes.number,
  };

  static defaultProps = {
    eventHeight: 30,
    fontSize: 18,
  };

  constructor(props) {
    super(props);
  };

  handleEventClick(e, event) {
    if (this.props.handleEventClick) {
      this.props.handleEventClick(e, event);
    }
  };

  onEventMouseOver(e, event) {
    event.pageTop = this.refs[`eventRect-${event.id}`].getBoundingClientRect().top;
    if (this.props.onEventMouseOver) {
      this.props.onEventMouseOver(e, event);
    }
  };

  onEventMouseLeave() {
    if (this.props.onEventMouseLeave) {
      this.props.onEventMouseLeave();
    }
  };

  render() {
    
    // event markers
    const xTextOffset = 4;
    const yTextOffset = (this.props.eventHeight-4-this.props.fontSize)/2;
    const eventMarkers = [];
    let yPos = 20;
    let i = 0;
    let preEventEndTime = null;

    for( const event of this.props.data ) {
      const beginPos = this.props.timeScale(event.startTime);
      const endPos = this.props.timeScale(event.endTime);

      if (endPos > 0 && beginPos < this.props.width) {
        // 計算 event y 軸位置 
        // 判斷 event 的時間是否有重疊，有重疊的話 event 往下擺放
        const stacked = preEventEndTime && (event.startTime-preEventEndTime <= 0) ? true : false;
        yPos = stacked ? yPos+this.props.eventHeight+10 : yPos;
        event.y = yPos;

        // 計算 event x 軸位置
        event.x = beginPos < 0 ? 0:beginPos;

        // 計算 event width
        event.width = endPos > this.props.width ? (this.props.width-event.x):(endPos-event.x);

        // 計算 event text
        const textX = event.x+xTextOffset;
        const textY = event.y+this.props.fontSize+yTextOffset;

        eventMarkers.push(
          <g key={`event-${i}`}>
            <rect
              x={event.x}
              y={event.y}
              rx={4}
              ry={4}
              width={event.width}
              height={this.props.eventHeight}
              style={{ fill:event.color}}
              onClick={e => this.handleEventClick(e, event)}
              onMouseOver={e => this.onEventMouseOver(e, event)}
              onMouseLeave={() => this.onEventMouseLeave()}
              ref={`eventRect-${event.id}`}
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

      } // end of if (endPos > 0)
      preEventEndTime = event.endTime;
      i += 1;
    } // end for

    // 所有 event 加總的高度
    const allEventHeight = yPos + this.props.eventHeight + 10;
    // 減 10 (because stroke width ?) 避免 svg event chart overflow
    const svgHeight = allEventHeight > this.props.height-10 ? allEventHeight:this.props.height-10;

    return (
      <div 
        style={{
          width:this.props.width, 
          height:this.props.height, 
          overflowX:'hidden', 
          overflowY:'auto',
          position:'absolute',
          top:this.props.top,
          left:0,
        }}
      >
        <svg 
          width={this.props.width} 
          height={svgHeight} 
          ref={(svg) => { this.svg = svg; }}
        >
          {eventMarkers}
        </svg>
      </div>
    );
  };
}