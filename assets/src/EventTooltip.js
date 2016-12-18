import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';

export default class EventTooltip extends Component {
  
  static propTypes = {
    xEventPos : PropTypes.number,
    yEventPos : PropTypes.number,
    eventWidth : PropTypes.number,
    eventStartTime : PropTypes.object,
    eventEndTime : PropTypes.object,
    eventTitle : PropTypes.string,

    //
    triangleHeight: PropTypes.number,
    infoTitleSize: PropTypes.number,
    infoTimeSize: PropTypes.number,
    infoHeight: PropTypes.number,
  };

  static defaultProps = {
    triangleHeight: 8,
    infoTitleSize: 18,
    infoTimeSize: 14,
    // infoTitleSize+infoTimeSize+10;
    infoHeight: 42,
  };

  constructor(props) {
    super(props);
  };

  render() {
    const {xEventPos, yEventPos, eventWidth, eventStartTime, eventEndTime, eventTitle, triangleHeight, infoTitleSize, infoTimeSize, infoHeight} = this.props;
    
    // triangle
    const centerPoint = {x:xEventPos+eventWidth/2, y:yEventPos};
    const leftPoint = {x:centerPoint.x-triangleHeight, y:centerPoint.y-triangleHeight};
    const rightPoint = {x:centerPoint.x+triangleHeight, y:centerPoint.y-triangleHeight};
    
    // info box
    const infoTitleWidth = (eventTitle.length*infoTitleSize);
    const infoTimeWidth = (eventStartTime.format("YYYY-MM-DD HH:mm:ss").length + 
                          eventEndTime.format("YYYY-MM-DD HH:mm:ss").length + 3 )*infoTimeSize;
    const infoWidth = infoTitleWidth > infoTimeWidth ? infoTitleWidth/2:infoTimeWidth/2;
    const xInfo = centerPoint.x - infoWidth/2;
    const yInfo = centerPoint.y - triangleHeight - infoHeight;

    return (
      <g>
        <polygon 
          points={`${leftPoint.x},${leftPoint.y} ${centerPoint.x},${centerPoint.y} ${rightPoint.x},${rightPoint.y}` }
          style={{ fill:'#ccc', opacity:0.9 }}
        />
        <rect
          x={xInfo}
          y={yInfo}
          rx={8}
          ry={8}
          width={infoWidth}
          height={infoHeight}
          style={{ fill:'#ccc', opacity:0.9 }}
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
  };
}
