import React, { Component } from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import { APPPATH, APICONFIG } from '../modules/helper.module';

class ImagePopup extends Component {
  constructor(props) {
    super();
    this.state = {
      showState: props.show,
      target: props.target,
      imgurl: props.imgurl,
      styleData: props.styleData,
    };
    // this.getimage(props.imgurl)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      showState: nextProps.show,
      target: nextProps.target,
      imgurl: nextProps.imgurl,
      styleData: nextProps.styleData,
    },() => {
      // this.getimage(nextProps.imgurl)
    });
  }

  getimage = (imgurl) => {
    fetch(imgurl,{
      method: 'GET',
      headers: APICONFIG.apiHeaders(),
    })
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      document.getElementById('srvimg').src = url;
    })
    .catch(err => console.log('Failed to fetch image:', err));
  }
  entering = (e) => {
    // console.log(e.children[0]);
    // console.log(e.children[1].offsetWidth);
    e.children[0].style.marginLeft = `${this.alignArrow()}`;
    // e.children[0].style.setProperty('--tooltiparrowborderbottomcolor', "#afafaf")
    e.children[0].style.marginTop = 5;
    e.children[1].style.width = `150px`;
    e.children[1].style.marginLeft = `0px`;
    
    e.children[1].style.backgroundColor = '#ffffff';//'#37aaf8';
    e.children[1].style.border = '1px solid #afafaf';//'#37aaf8';
    e.children[1].style.color ='#252525';//'#37aaf8';
    // e.children[1].style.setProperty('--tooltipshadowcolor1', 'rgba(175, 175, 175, 0.16)');
    // e.children[1].style.setProperty('--tooltipshadowcolor2', 'rgba(175, 175, 175, 0.23)');  
    e.children[1].style.fontSize = '12px';
  };
  alignToolTip = (width) => {
    if (this.state.styleData.ToolTip && this.state.styleData.ToolTip.align) {
      switch (this.state.styleData.ToolTip.align) {
        case 'center':
          return width * 0.5 * -1;
        case 'right':
          return width * 0.75 * -1;
        case 'slightright':
          return width * 0.25 ;
        case 'slightright1':
          return width * 0.35 ;
        case 'pushedright':
          return width * 1;
        case 'pushedleft':
          return width * -1;
        case 'left':
          return 0;
        case 'left-center':
          return 25;
        case 'slightleft':
          return width * 0.25 * -1;
        case 'leftmedium':
          return width * -0.25 * -1;
        default:
          return this.state.styleData.ToolTip.align;
      }
    }
    return '0';
  };
  alignArrow = () => {
    if (this.state.styleData.Arrow && this.state.styleData.Arrow.marginLeft) {
      return this.state.styleData.Arrow.marginLeft;
    }
    if (this.state.styleData.Arrow && this.state.styleData.Arrow.marginRight) {
      return this.state.styleData.Arrow.marginRight;
    }
    
    return '0px';
  };

  render() {
    const { target, showState, imgurl } = this.state;
    // console.log(target, showState, imgurl)
    // if (!isMobile) {
      if (showState) {
        return (
          <Overlay container={target} show={showState} placement="bottom" onEntering={this.entering}>
            {({ placement, arrowProps, poppers, show, ...props }) => {
              // console.log(placement, arrowProps, props);

              return (
                <Tooltip id={`trigger-tool-tip`} placement={placement} style={{}}>
                  <img crossorigin="anonymous" id="srvimg" src={`${imgurl}?not-from-cache-please`} style={{width: '100px', height: '100px'}} />
                </Tooltip>
              );
            }}
          </Overlay>
        );
      } else {
        return '';
      }
    // } else {
    //   return '';
    // }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  };
};

const mapDispatchToProps = {
  
};

export default connect(mapStateToProps, mapDispatchToProps)(ImagePopup);
