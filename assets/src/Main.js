import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import EventChart from './EventChart';
import TimeAxis from './TimeAxis';
// Pond
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import { scaleTime, scaleUtc } from 'd3-scale';
import Moment from 'moment';

export default class Main extends Component {
  
  static propTypes = {
  }

  constructor(props) {
    super(props);
  };

  render() {
    
    return(
      <div>
        <h1>Timeline</h1>
        <EventChart />
      </div>
    )
  }
}