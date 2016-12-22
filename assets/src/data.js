import Moment from 'moment';

const yellow = "#e7d77f";
const blue = "#7ec9e9";
const green = "#72e78f";
const red  = "#f59098";
const gray = 'grey';

// Test data
export const unplannedEventsData = [
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

export const plannedEventsData = [
  {
    id: 11,
    startTime: Moment('2016-12-12 13:00:00'),
    endTime: Moment('2016-12-13 13:00:00'),
    title: "event 1",
    color: gray,
  }, {
    id: 12,
    startTime: Moment('2016-12-13 14:00:00'),
    endTime: Moment('2016-12-14 14:00:00'),
    title: "event 2",
    color: gray,
  }, {
    id: 13,
    startTime: Moment('2016-12-14 15:00:00'),
    endTime: Moment('2016-12-15 15:00:00'),
    title: "event 3",
    color: gray,
  }
];