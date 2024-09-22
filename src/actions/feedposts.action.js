import { APICONFIG, ErrorHandleHelper } from '../modules/helper.module';
import Store from '../store';
import * as moment from 'moment';

export function getfeedpostsdata() {
    return (dispatch) => {
      fetch(`${APICONFIG.apiBaseUrl}/feed_posts`, {
        method: 'GET',
        headers: APICONFIG.apiHeaders(),
      })
        .then(async (response) => {
          if (response.status === 200 && response.ok) {
            await response.json().then((result) => {
              if(result.status === true) {
                dispatch({
                    type: 'FEED_POST_DATA',
                    payload: result.data,
                });
              }
              
              
            });
          } else {
            await response.json().then((result) => {
              console.log(result)
              throw new Error(`${response.status} : ${response.statusText} - ${result.Message}`);
            });
          }
        })
        .catch((err) => {
          console.log(err)
        });
    };
}