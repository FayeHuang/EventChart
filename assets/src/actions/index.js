// redux actions

/*
page releated
*/
export const WINDOW_RESIZE = 'WINDOW_RESIZE';
export function windowResize(windowWidth, windowHeight) {
  return {
    type: WINDOW_RESIZE,
    windowWidth,
    windowHeight,
  }
}

/*
event chart releated
*/
export const TIMELINE_START_DRAG = 'TIMELINE_START_DRAG';
export const TIMELINE_STOP_DRAG = 'TIMELINE_STOP_DRAG';
export const TIMELINE_DRAGGING = 'TIMELINE_DRAGGING';
export const TIMELINE_ZOOMING = 'TIMELINE_ZOOMING';
export const EVENT_HOVER = 'EVENT_HOVER';
export const EVENT_HOVER_OUT = 'EVENT_HOVER_OUT';
export const EVENT_DIALOG_OPEN = 'EVENT_DIALOG_OPEN';
export const EVENT_DIALOG_CLOSE = 'EVENT_DIALOG_CLOSE';

export function timelineStartDrag(mouseXPos) {
  return {
    type: TIMELINE_START_DRAG,
    mouseXPos,
  }
}

export function timelineStopDrag() {
  return {
    type: TIMELINE_STOP_DRAG,
  }
}

export function timelineDragging(mouseXPos, chartStartTime, chartEndTime) {
  return {
    type: TIMELINE_DRAGGING,
    mouseXPos,
    chartStartTime,
    chartEndTime,
  }
}

export function timelineZooming(chartStartTime, chartEndTime) {
  return {
    type: TIMELINE_ZOOMING,
    chartStartTime,
    chartEndTime,
  }
}

export function eventHover(event) {
  return {
    type: EVENT_HOVER,
    event,
  }
}

export function eventHoverOut(event) {
  return {
    type: EVENT_HOVER_OUT,
  }
}

export function eventDialogOpen(event) {
  return {
    type: EVENT_DIALOG_OPEN,
    event,
  }
}

export function eventDialogClose(event) {
  return {
    type: EVENT_DIALOG_CLOSE,
  }
}



