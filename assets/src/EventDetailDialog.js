import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';
import Dialog from 'material-ui/Dialog';
import GoogleMap from 'google-map-react';
import MyMarker from './MyMarker';

export default class EventDetailDialog extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired,
    dialogOpen: PropTypes.bool.isRequired,
    handleEventDialogClose: PropTypes.func.isRequired,
  };
  
  static defaultProps = {};
  
  constructor(props) {
    super(props);
  };

  handleEventDialogClose() {
    if (this.props.handleEventDialogClose) {
      this.props.handleEventDialogClose();
    }
  };
  
  render() {
    return(
      <Dialog
        title="事件說明"
        modal={false}
        open={this.props.dialogOpen}
        onRequestClose={() => this.handleEventDialogClose()}
        contentStyle={{width: '100%', maxWidth: 'none'}}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 col-md-5 col-sm-12">
              <h3>{`${this.props.event.title}  (#${this.props.event.id})`}</h3>
              <div>{this.props.event.startTime.format("YYYY-MM-DD HH:mm:ss")} 
                  - {this.props.event.endTime.format("YYYY-MM-DD HH:mm:ss")}</div>
              <div>客訴地點 : 中正紀念堂</div>
              <div>通路 : 客服 APP</div>
              <div>條件 : 停留點內連線品質低於 60%</div>
            </div>
            <div className="col-lg-8 col-md-7 col-sm-12" style={{height:400}}>
              <GoogleMap
                defaultCenter={{lat:25.034692, lng:121.521750}}
                defaultZoom={14}
                center={{lat:25.034692, lng:121.521750}}
              >
                <MyMarker lat={25.034692} lng={121.521750} />
              </GoogleMap>
            </div>
          </div>
        </div>
      </Dialog>
    )
  };
}