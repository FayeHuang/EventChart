import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import {getTextWidth} from './util';

export default class EventTooltip extends Component {
  
  static propTypes = {
    event: PropTypes.object.isRequired,
    chartWidth: PropTypes.number.isRequired,
    chartHeight: PropTypes.number.isRequired,
    chartYBeginPos: PropTypes.number.isRequired,
    windowYOffset: PropTypes.number.isRequired,
    //
    infoTitleSize: PropTypes.number,
    infoTimeSize: PropTypes.number,
  };

  static defaultProps = {
    infoTitleSize: 18,
    infoTimeSize: 14,
  };

  constructor(props) {
    super(props);
  };

  render() {
    const {event, infoTitleSize, infoTimeSize} = this.props;

    const eventAbsoluteY = (event.pageTop-this.props.chartYBeginPos+this.props.windowYOffset) > 0 ?
      (event.pageTop-this.props.chartYBeginPos+this.props.windowYOffset):0;

    // 計算 infobox width & height
    const infoPadding = 10;
    const titleTimePadding = 5;
    const infoTitleWidth = getTextWidth(event.title, `${infoTitleSize}px Arial`);
    const timeStr = `${event.startTime.format("YYYY-MM-DD HH:mm:ss")} - ${event.endTime.format("YYYY-MM-DD HH:mm:ss")}`;
    const infoTimeWidth = getTextWidth(timeStr, `${infoTimeSize}px Arial`);
    const infoWidth = infoTitleWidth > infoTimeWidth ? (infoTitleWidth+infoPadding*2):(infoTimeWidth+infoPadding*2);
    const infoHeight = infoPadding*2 + titleTimePadding + infoTitleSize + infoTimeSize + 15;

    // triangle width & height
    const triangleHeight = 10;
    const triangleWidth = 2*triangleHeight;

    
    // triangle position
    // 正方型斜邊長
    const rectHypotenuseLength = 2*triangleHeight;
    const rectLength = Math.sqrt(Math.pow(rectHypotenuseLength,2) / 2);
    const rectX = event.x+event.width/2-triangleWidth/2+5;
    const rectY = eventAbsoluteY-triangleHeight*2+3;
    
    // info box position
    const infoXBegin = (event.x+event.width/2-infoWidth/2-infoPadding) < 0 ? 0:(event.x+event.width/2-infoWidth/2-infoPadding);
    const infoXEnd = infoXBegin+infoWidth+2*infoPadding;
    const infoX = infoXEnd > this.props.chartWidth ? (this.props.chartWidth+10)-2*infoPadding-infoWidth:infoXBegin;
    const infoY = (eventAbsoluteY-triangleHeight-infoHeight);

    return (
      <div style={{
        width:this.props.chartWidth,
        height:this.props.chartHeight,
        position:'absolute',
        top:0,
        left:0
      }}>
        
        {/* info box */}
        <div 
          style={{
            width:infoWidth,
            height:infoHeight,
            position:'absolute',
            background: '#bdbdbd',
            // opacity: 0.9,
            top:infoY,
            left:infoX,
            padding:infoPadding,
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            zIndex: 997
          }}
        >
            <div style={{
              fontSize: this.props.infoTitleSize,
              paddingBottom: titleTimePadding,
            }}>
              {event.title}
            </div>

            <div style={{
              fontSize: this.props.infoTimeSize,
            }}>
              {timeStr}
            </div>
        </div>

        {/* triangle */}
        <div 
          style={{
            //borderColor: '#bdbdbd transparent transparent transparent',
            //borderStyle: 'solid',
            //borderWidth: `${triangleHeight}px ${triangleWidth/2}px`,
            width:rectLength,
            height:rectLength,
            background: '#bdbdbd',
            position:'absolute',
            top:rectY,
            left:rectX,
            transform: 'rotate(-45deg)',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            zIndex: 998
          }}
        />
        <div 
          style={{
            width:infoWidth,
            height:triangleHeight,
            background: '#bdbdbd',
            position:'absolute',
            top:eventAbsoluteY-2*triangleHeight,
            left:infoX,
            zIndex: 999
          }}
        />
      </div>
    );
  };
}
