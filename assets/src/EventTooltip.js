import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';
import {getTextWidth} from './util';

export default class EventTooltip extends Component {
  
  static propTypes = {
    event: PropTypes.object.isRequired,
    //
    triangleHeight: PropTypes.number,
    infoTitleSize: PropTypes.number,
    infoTimeSize: PropTypes.number,
    //infoHeight: PropTypes.number,
  };

  static defaultProps = {
    triangleHeight: 8,
    infoTitleSize: 18,
    infoTimeSize: 14,
    // infoTitleSize+infoTimeSize+10;
    //infoHeight: 42,
  };

  constructor(props) {
    super(props);
  };

  

  render() {
    const {event, triangleHeight, infoTitleSize, infoTimeSize} = this.props;
    // console.log(event);
    
    // const eventBeginPos = event.beginPos < 0 ? 0:event.beginPos;
    // const eventEndPos = event.endPos;
    // const eventWidth = eventEndPos - eventBeginPos;
    // const eventY = event.y;
    // // triangle
    // const centerPoint = {x:eventBeginPos+eventWidth/2, y:eventY};
    // const leftPoint = {x:centerPoint.x-triangleHeight, y:centerPoint.y-triangleHeight};
    // const rightPoint = {x:centerPoint.x+triangleHeight, y:centerPoint.y-triangleHeight};
    const tooltipPadding = 10;
    const titleTimePadding = 5;
    const infoTitleWidth = getTextWidth(event.title, `${infoTitleSize}px Arial`);
    const timeStr = `${event.startTime.format("YYYY-MM-DD HH:mm:ss")} - ${event.endTime.format("YYYY-MM-DD HH:mm:ss")}`;
    const infoTimeWidth = getTextWidth(timeStr, `${infoTimeSize}px Arial`);
    const infoWidth = infoTitleWidth > infoTimeWidth ? (infoTitleWidth+tooltipPadding*2):(infoTimeWidth+tooltipPadding*2);
    const infoHeight = tooltipPadding*2 + titleTimePadding + infoTitleSize + infoTimeSize + 15;
    return (
      <div style={{
        width:infoWidth,
        height:infoHeight,
        position:'absolute',
        background: '#8b8b8b',
        opacity: 0.9,
        top:-10,
        bottom:0,
        left:0,
        right:0,
        zIndex: 999,
      }}>
        <div style={{padding:tooltipPadding}}>
          <div style={{
            fontSize: this.props.infoTitleSize,
            paddingBottom: titleTimePadding,
          }}>
            event ttt
          </div>

          <div style={{
            fontSize: this.props.infoTimeSize,
          }}>
            {timeStr}
          </div>
        </div>
      </div>
    );
    /*
    // info box
    const infoTitleWidth = (eventTitle.length*infoTitleSize);
    const infoTimeWidth = (eventStartTime.format("YYYY-MM-DD HH:mm:ss").length + 
                          eventEndTime.format("YYYY-MM-DD HH:mm:ss").length + 3 )*infoTimeSize;
    const infoWidth = infoTitleWidth > infoTimeWidth ? infoTitleWidth/2+10:infoTimeWidth/2+10;
    const xInfo = centerPoint.x - infoWidth/2;
    const yInfo = centerPoint.y - triangleHeight - infoHeight;

    return (
      <g>
        <polygon 
          points={`${leftPoint.x},${leftPoint.y} ${centerPoint.x},${centerPoint.y} ${rightPoint.x},${rightPoint.y}` }
          style={{ fill:'#E8EAEB', opacity:0.9 }}
        />
        <rect
          x={xInfo}
          y={yInfo}
          //rx={8}
          //ry={8}
          width={infoWidth}
          height={infoHeight}
          style={{ fill:'#E8EAEB', opacity:0.9 }}
        />
        <text 
          x={xInfo+8}
          y={yInfo+infoTitleSize} 
          style={{ fill:'#333', fontSize:`${infoTitleSize}px` }}
        >
          {eventTitle}
        </text>
        <text 
          x={xInfo+8}
          y={yInfo+infoTitleSize+infoTimeSize+4} 
          style={{ fill:'#333', fontSize:`${infoTimeSize}px` }}
        >
          {eventStartTime.format("YYYY-MM-DD HH:mm:ss")} - {eventEndTime.format("YYYY-MM-DD HH:mm:ss")}
        </text>
      </g>
    )
    */
  };
}
