// redux reducers
import Moment from 'moment';

/*
page releated
*/
import {WINDOW_RESIZE} from '../actions';

function page(state = { 
  windowWidth: window.innerWidth, 
  windowHeight: window.innerHeight,
}, action) {
  switch (action.type) {
    case WINDOW_RESIZE:
      return Object.assign({}, state, {
        windowWidth: action.windowWidth,
        windowHeight: action.windowHeight,
      })
    default:
      return state
  }
}

/*
event chart releated
*/
import {
  TIMELINE_START_DRAG,
  TIMELINE_STOP_DRAG,
  TIMELINE_DRAGGING,
  TIMELINE_ZOOMING,
  EVENT_HOVER,
  EVENT_HOVER_OUT,
  EVENT_DIALOG_OPEN,
  EVENT_DIALOG_CLOSE,
} from '../actions';

function eventChart(state = { 
  mouseXPos: -1,
  chartStartTime: Moment('2016-12-12 09:00:00'),
  chartEndTime: Moment('2016-12-16 09:00:00'),
  hoverEvent: null,
  clickEvent: null,
  eventDialogOpen: false,
}, action) {
  switch (action.type) {
    case TIMELINE_START_DRAG:
      return Object.assign({}, state, {
        mouseXPos: action.mouseXPos,
      })
    case TIMELINE_STOP_DRAG:
      return Object.assign({}, state, {
        mouseXPos: -1,
      })
    case TIMELINE_DRAGGING:
      return Object.assign({}, state, {
        mouseXPos: action.mouseXPos,
        chartStartTime: action.chartStartTime,
        chartEndTime: action.chartEndTime,
      })
    case TIMELINE_ZOOMING:
      return Object.assign({}, state, {
        chartStartTime: action.chartStartTime,
        chartEndTime: action.chartEndTime,
      })
    case EVENT_HOVER:
      return Object.assign({}, state, {
        hoverEvent: action.event,
      })
    case EVENT_HOVER_OUT:
      return Object.assign({}, state, {
        hoverEvent: null,
      })
    case EVENT_DIALOG_OPEN:
      return Object.assign({}, state, {
        eventDialogOpen: true,
        clickEvent: action.event,
      })
    case EVENT_DIALOG_CLOSE:
      return Object.assign({}, state, {
        eventDialogOpen: false,
        clickEvent: null,
      })
    default:
      return state
  }
}



import { combineReducers } from 'redux'
const rootReducer = combineReducers({ page, eventChart });
export default rootReducer