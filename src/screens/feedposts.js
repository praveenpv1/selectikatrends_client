import React, { Component } from 'react'; 
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import DataTable from 'react-data-table-component';

import * as moment from 'moment';
import { getfeedpostsdata } from '../actions/feedposts.action';
import ImagePopup from '../components/imagepopup';

class FeedPosts extends Component {
  
  constructor(props) {
    super();
    this.state = {
      data: props.data,   
      imagepopupshowsate: false,
      popupurl: '',
      popupstyle: {}
    }
    this.attached_carousel_media_urls = '';
    this.imagepopupinterval = '';
  }

  componentDidMount() {
    if(!this.state.data.length) {
      this.props.getfeedpostsdata();
    }
  
  }
  
  
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      data: nextProps.data
    })
  }
  showimagetip = (e, status, url = false) => {
    // console.log(e.target, status);
    this.attached_carousel_media_urls = e.target
    clearTimeout(this.imagepopupinterval)
    this.setState({
      ...this.state,
      imagepopupshowsate: false,
    }, () => {
      if(status) {
        this.imagepopupinterval = setTimeout(() => {
          
          let arrowstyledata = {};
          arrowstyledata.marginLeft = '10px';
          let popupStyleData = {
            Arrow: { ...arrowstyledata },
            
          };
          this.setState({
            ...this.state,
            imagepopupshowsate: status,
            popupurl: url === false ? '' : url,
            popupstyle: popupStyleData
          })
        }, 1000)
        
      }
      
    })
    
  }
 

  render() {
    const { data } = this.state;
    const { dataItemTemplate } = this.props
    let columns = [];

    dataItemTemplate.forEach((itm) => {
      let name = itm.replace(/_/g," ");
      let colObj = {
        name,
        selector: row => row[`${itm}`],
        sortable: true
      }
      if(itm === 'attached_carousel_media_urls') {
        colObj.cell = (row, index) => {
          
          let cellview = [];
          
          if(row[`${itm}`] !== null) {
            
            let view = row[`${itm}`].map((url, i) => 
              <span style={{padding: 5}}>
                <a ref={React.createRef()} style={{minWidth: '50px'}} href={url} target="_blank"
                  onMouseEnter={(e) => {
                    this.showimagetip(e, true, url)
                  }}
                  onMouseOut={(e) => {
                    this.showimagetip(e, false)
                  }}
                >
                  {`URL${i +1} `}
                </a>
                {`${i < row[`${itm}`].length-1 ? ' ,' : ''}`}
              </span>
            )
            
            cellview.push(view);
          }
          return cellview;
        }
        // colObj.sortable = true;
      } else if(itm === 'attached_media_content') {
        
        colObj.cell = row => <div className='cellwrap' title={`${row[`${itm}`]}`}>{ row[`${itm}`] }</div>
      } else if(itm === 'attached_media_display_url') {
        
        colObj.cell = (row, index) => {
          // console.log(row[`${itm}`])
          return (
            <div className=''>
              <a 
                style={{minWidth: '50px', display: row[`${itm}`] === null ? 'none' : ''}} 
                href={row[`${itm}`]} target="_blank" 
                
                onMouseEnter={(e) => {
                  this.showimagetip(e, true, row[`${itm}`])
                }}
                onMouseOut={(e) => {
                  this.showimagetip(e, false)
                }}
              >{`URL`}</a>
            </div>
          )
        }
      } else if(itm === 'attached_media_tagged_users') {
        
        colObj.cell = row => <div className='cellwrap' title={`${row[`${itm}`] !== null ? row[`${itm}`].join(', ') : row[`${itm}`]}`}>
          { row[`${itm}`] !== null ? row[`${itm}`].join(', ') : row[`${itm}`] }
        </div>
      } else if(itm === 'attached_video_url') {
        
        colObj.cell = row => <div className='' title={`${row[`${itm}`]}`}>
          <a style={{minWidth: '50px', display: row[`${itm}`] === null ? 'none' : ''}} href={row[`${itm}`]} target="_blank" title={row[`${itm}`]}>{`URL`}</a>
        </div>
      } else if(itm === 'created_time') {
        colObj.cell = row => <div className='cellwrap' title={`${moment(row[`${itm}`]).format('DD-MM-YYYY')}`}>{ moment(row[`${itm}`]).format('DD-MM-YYYY') }</div>
      } else {
        colObj.cell = row => <div className='cellwrap' title={`${row[`${itm}`]}`}>{ row[`${itm}`] }</div>
      } 
      columns.push(colObj);
    })

    
    return(
      <Row className="justify-content-center text-center">
        <Col lg={12} sm={12} xs={12} md={12} xl={12} className="pad15 overflow-auto" >
          <DataTable data={data} pagination={true} columns={columns} fixedHeader={true} fixedHeaderScrollHeight={'88vh'} />
          
          <ImagePopup show={this.state.imagepopupshowsate} target={this.attached_carousel_media_urls} styleData={this.state.popupstyle} imgurl={this.state.popupurl} />
        </Col>
      </Row>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    data: state.feedposts.data,
    dataItemTemplate: state.feedposts.dataItemTemplate
  }
}

const mapDispatchToProps = {
  getfeedpostsdata
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedPosts)