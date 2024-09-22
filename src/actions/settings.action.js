import { APICONFIG, ErrorHandleHelper } from '../modules/helper.module';
import Store from '../store';
import * as moment from 'moment';

async function getEventById(data) {
  try {
    let response = await fetch(
      `${APICONFIG.apiBaseUrl}/api/alerts/getalertbyeventid?eventId=${data.EventId
      }&userName=${APICONFIG.apiLoggedInUser()}`,
      {
        method: 'GET',
        headers: APICONFIG.apiHeaders(),
      }
    );
    let result = await response.json();
    if (response.status === 200 && response.ok) {
      return {
        status: true,
        result,
      };
    } else {
      throw new Error(`${response.status} : ${response.statusText} - ${result.Message}`);
    }
  } catch (err) {
    return {
      status: false,
      result: err.error,
    };
  }
}


export function updaterendertype(rendertype) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_RENDERTYPE',
      payload: rendertype,
    });
  };
}
export function updateiframeasset(asset) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_IFRAME_ASSET',
      payload: asset,
    });
  };
}
export function setIframeFilters(filters) {
  return (dispatch) => {
    // console.log(nav)
    dispatch({
      type: 'UPDATE_IFRAME_FILTERS',
      payload: filters,
    });
  };
}
export function updateiframenav(nav) {
  return (dispatch) => {
    // console.log(nav)
    dispatch({
      type: 'UPDATE_IFRAME_NAV',
      payload: nav,
    });
  };
}
export function updateiframeassetsecurity(assetdata = false) {
  return (dispatch) => {
    if (assetdata !== false) {
      let iframesearchdata = {}
      iframesearchdata.startDate = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
      iframesearchdata.endDate = moment().format('YYYY-MM-DD HH:mm:ss')
      iframesearchdata.freeText = '';
      iframesearchdata.withCurated = false;//this.props.Search_with_gray;
      iframesearchdata.withBlack = false;//this.props.Search_with_black;
      iframesearchdata.withWhite = false;//this.props.Search_with_white;
      iframesearchdata.withYellow = true;//this.props.Search_with_yellow;
      iframesearchdata.withOrange = true;//this.props.Search_with_orange;
      iframesearchdata.withRed = true;//this.props.Search_with_red;
      iframesearchdata.columnCollapsePreference = true;
      iframesearchdata.event = [];
      iframesearchdata.secTyp = [];
      iframesearchdata.sec = [`${assetdata.Name}`];
      iframesearchdata.ticker = [`${assetdata.Symbol}`];
      iframesearchdata.src = [];
      let Data = {
        UserSavedDataID: assetdata.SecurityID,
        SavedDataTitle: assetdata.Name,
        SavedDataDetails: JSON.stringify(iframesearchdata),
        UserName: '',
        columntype: 'SavedSearch',
        columnFilter: 'Inbox'
      };
      dispatch({
        type: 'UPDATE_IFRAME_ASSET_SECURITY',
        payload: assetdata,
      });
      dispatch({
        type: 'SET_SAVED_SEARCH_IFRAME',
        payload: {
          [`${Data.UserSavedDataID}`]: Data
        }
      });
    } else {
      dispatch({
        type: 'UPDATE_IFRAME_ASSET_SECURITY',
        payload: assetdata,
      });
    }

  };
}
export function updateforcetheme(theme) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_FORCETHEME',
      payload: theme,
    });
  };
}
export function updatelanguagesettings(lang) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_LANGUAGE_SETTINGS',
      payload: lang,
    });
  };
}
export function dataRequestInitiating(status) {
  return (dispatch) => {
    dispatch({
      type: 'SET_INIT_REQUEST_STATUS',
      payload: status,
    });
  };
}
export function setiframelogo(status) {
  return (dispatch) => {
    dispatch({
      type: 'SET_IFRAME_LOGO',
      payload: status,
    });
  };
}

export function CheckIncSMS() {
  return (dispatch) => {
    fetch(`${APICONFIG.apiBaseUrl}/api/messages/getmessagesforuser?userName=${APICONFIG.apiLoggedInUser()}`, {
      method: 'GET',
      headers: APICONFIG.apiHeaders(),
    })
      .then(async (response) => {
        // console.log(response);
        if (response.status === 200 && response.ok) {
          await response.json().then((result) => {
            // console.log(result)
            if (result.length) {
              let incEvnts = [];
              result.map(async (sms, i) => {
                let evnt = await getEventById(sms);
                console.log(evnt);
                if (evnt.status) {
                  incEvnts.push({ ...sms, event: evnt.result });
                }
                if (i === result.length - 1) {
                  console.log(incEvnts);
                  if (incEvnts.length) {
                    // let updatedFeeds = update_feeds(incEvnts);
                    // console.log(updatedFeeds)
                    // dispatch({
                    //   type: 'SET_MESSAGE_NOTIF_UPDATED_FEEDS',
                    //   payload: updatedFeeds
                    // })
                    dispatch({
                      type: 'SET_INCMESSAGE',
                      payload: incEvnts,
                    });
                  }
                }
              });
            }
          });
        } else {
          await response.json().then((result) => {
            // console.log(result)
            throw new Error(`${response.status} : ${response.statusText} - ${result.Message}`);
          });
        }
      })
      .catch((err) => {
        let data = {
          username: APICONFIG.apiLoggedInUser(),
          action: 'Check User Message',
          url: `${APICONFIG.apiBaseUrl}/api/messages/getmessagesforuser?userName=${APICONFIG.apiLoggedInUser()}`,
          severity: 'low',
        };
        dispatch({
          type: 'REQUEST_ERROR',
          payload: ErrorHandleHelper.generateErrorString(err, 'CheckIncSMS'),
          data: data,
        });
      });
  };
}

export function getSystemTime() {
  return (dispatch) => {
    fetch(`${APICONFIG.apiBaseUrl}/api/timemanager/getsystemopentime?userName=${APICONFIG.apiLoggedInUser()}`, {
      method: 'GET',
      headers: APICONFIG.apiHeaders(),
    })
      .then(async (response) => {
        if (response.status === 200 && response.ok) {
          await response.json().then((result) => {
            // result.IsOpen = false
            // result.IsWeekend = true;
            // result.IsSpecialClose = true;
            // result.Message = 'Test';
            // result.TimeToNextState = 2;
            // console.log(result)
            dispatch({
              type: 'SYSTEM_TIME',
              payload: result,
            });
          });
        } else {
          await response.json().then((result) => {
            // console.log(result)
            throw new Error(`${response.status} : ${response.statusText} - ${result.Message}`);
          });
        }
      })
      .catch((err) => {
        let data = {
          username: APICONFIG.apiLoggedInUser(),
          action: 'Get System Time',
          url: `${APICONFIG.apiBaseUrl}/api/timemanager/getsystemopentime?userName=${APICONFIG.apiLoggedInUser()}`,
          severity: 'low',
        };
        dispatch({
          type: 'REQUEST_ERROR',
          payload: ErrorHandleHelper.generateErrorString(err, 'GetSystemTime'),
          data: data,
        });
      });
  };
}

export function getUserFeedBack(startDate, endDate) {
  return (dispatch) => {
    fetch(
      `${APICONFIG.apiBaseUrl
      }/api/Feedbacks/getfeedbacksbyuser?userName=${APICONFIG.apiLoggedInUser()}&startDate=${startDate}&endDate=${endDate}`,
      {
        method: 'GET',
        headers: APICONFIG.apiHeaders(),
      }
    )
      .then(async (response) => {
        // console.log(response);
        if (response.status === 200 && response.ok) {
          await response.json().then((result) => {
            // console.log(result)
            dispatch({
              type: 'FEEDBACK_GET',
              payload: result,
            });
          });
        } else {
          await response.json().then((result) => {
            // console.log(result)
            throw new Error(`${response.status} : ${response.statusText} - ${result.Message}`);
          });
        }
      })
      .catch((err) => {
        let data = {
          username: APICONFIG.apiLoggedInUser(),
          action: 'Get User Feedback',
          url: `${APICONFIG.apiBaseUrl
            }/api/Feedbacks/getfeedbacksbyuser?userName=${APICONFIG.apiLoggedInUser()}&startDate=${startDate}&endDate=${endDate}`,
          severity: 'low',
        };
        dispatch({
          type: 'REQUEST_ERROR',
          payload: ErrorHandleHelper.generateErrorString(err, 'getUserFeedBack'),
          data: data,
        });
      });
  };
}

export function getOrgUsers() {
  return (dispatch) => {
    fetch(`${APICONFIG.apiBaseUrl}/api/messages/getusersfromorg?userName=${APICONFIG.apiLoggedInUser()}`, {
      method: 'GET',
      headers: APICONFIG.apiHeaders(),
    })
      .then(async (response) => {
        // console.log(response);
        if (response.status === 200 && response.ok) {
          await response.json().then((result) => {
            let filterArr = result.split(';');
            dispatch({
              type: 'SET_ORG_USERS',
              payload: filterArr,
            });
          });
        } else {
          await response.json().then((result) => {
            // console.log(result)
            throw new Error(`${response.status} : ${response.statusText} - ${result.Message}`);
          });
        }
      })
      .catch((err) => {
        let data = {
          username: APICONFIG.apiLoggedInUser(),
          action: 'Get Org Users',
          url: `${APICONFIG.apiBaseUrl}/api/messages/getusersfromorg?userName=${APICONFIG.apiLoggedInUser()}`,
          severity: 'low',
        };
        dispatch({
          type: 'REQUEST_ERROR',
          payload: ErrorHandleHelper.generateErrorString(err, 'getOrgUsers'),
          data: data,
        });
      });
  };
}

export function tipHandle(stat, tipOnId, tipType) {
  // console.log(stat, tipOnId, tipType)
  return (dispatch) => {
    dispatch({
      type: 'TIP_CLICKED',
      payload: { tipstate: stat, tiptype: tipType, tipOnId: tipOnId },
    });
  };
}

export function resetTipHandles() {
  return (dispatch) => {
    dispatch({
      type: 'TIP_RESET_GLOBAL',
    });
  };
}

export function setEventFeedBackWithReason(feedBackData, SecurityName = null) {
  return (dispatch) => {
    // console.log(SecurityName)
    fetch(`${APICONFIG.apiBaseUrl}/api/Feedbacks/setfeedbackbyuser`, {
      method: 'POST',
      body: JSON.stringify(feedBackData),
      headers: APICONFIG.apiHeaders(),
    })
      .then(async (response) => {
        if (response.status === 200 && response.ok) {
          // await response.json().then((result) => {
          let data = {
            UserID: feedBackData.UserName,
            FeedbackCreationTime: moment().utcOffset(0).format(),
            Like: feedBackData.Vote,
            EventID: feedBackData.EventID,
            Reason: feedBackData.Categories,
            OtherMessage: feedBackData.OtherMessage,
          };

          dispatch({
            type: 'FEEDBACK_SET',
            payload: data,
          });
          dispatch({
            type: 'UPDATE_STORYEVENT_LIKES',
            payload: {
              Like: feedBackData.Vote,
              EventID: feedBackData.EventID,
            },
          });
          dispatch({
            type: 'UPDATE_SEARCHEVENT_LIKES',
            payload: {
              Like: feedBackData.Vote,
              EventID: feedBackData.EventID,
            },
          });
          dispatch({
            type: 'UPDATE_SAVEDSEARCHEVENT_LIKES',
            payload: {
              Like: feedBackData.Vote,
              EventID: feedBackData.EventID,
            },
          });
          dispatch({
            type: 'UPDATE_COINCOLUMNEVENT_LIKES',
            payload: {
              Like: feedBackData.Vote,
              EventID: feedBackData.EventID,
              SecurityName
            },
          });
          // })
        } else {
          // await response.json().then((result) => {
          // console.log(result)
          throw new Error(`${response.status} : ${response.statusText}`);
          // })
        }
      })
      .catch((err) => {
        let data = {
          username: feedBackData.UserName,
          action: 'Setting Event Feedback',
          url: `${APICONFIG.apiBaseUrl}/api/Feedbacks/setfeedbackbyuser`,
          severity: 'low',
        };
        dispatch({
          type: 'REQUEST_ERROR',
          payload: ErrorHandleHelper.generateErrorString(err, 'setEventFeedBackWithReason'),
          data: data,
        });
      });
  };
}

export function sendMessage(data) {
  return (dispatch) => {
    fetch(`${APICONFIG.apiBaseUrl}/api/messages/sendeventmessage`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: APICONFIG.apiHeaders(),
    }).then((result) => {
      // console.log(result);

      dispatch({
        type: 'SET_SENDMESSAGE',
        payload: '',
      });
    });
  };
}

export function sendFeedback(data) {
  return (dispatch) => {
    fetch(`${APICONFIG.apiBaseUrl}/api/Feedbacks/sendfeedbackmessage`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: APICONFIG.apiHeaders(),
    })
      .then(async (response) => {
        // console.log(response);
        if (response.status === 200 && response.ok) {
          // await response.json().then((result) => {
          // console.log(result)

          dispatch({
            type: 'FEEDBACK_SEND',
            payload: 'Feedback send successfully.',
          });
          // });
        } else {
          await response.json().then((result) => {
            // console.log(result)

            dispatch({
              type: 'FEEDBACK_SEND',
              payload: 'Failed to send feedback. Please try again later.',
            });
          });
        }
      })
      .catch((err) => {
        let data = {
          username: APICONFIG.apiLoggedInUser(),
          action: 'Send Feedback',
          url: `${APICONFIG.apiBaseUrl}/api/Feedbacks/sendfeedbackmessage`,
          severity: 'low',
        };
        dispatch({
          type: 'REQUEST_ERROR',
          payload: ErrorHandleHelper.generateErrorString(err, 'SendFeedBack'),
          data: data,
        });
      });
  };
}

export function finishSendFeedback() {
  return (dispatch) => {
    dispatch({
      type: 'FEEDBACK_SEND',
      payload: false,
    });
  };
}

export function finishChangePass() {
  return (dispatch) => {
    dispatch({
      type: 'PASSWORD_CHANGED',
      payload: { tried: false, successFlag: false, status: '' },
    });
  };
}

export function finishInitialChangePass() {
  return (dispatch) => {
    dispatch({
      type: 'INITIAL_PASSWORD_CHANGED',
      payload: true,
    });
  };
}

export function changePass(data) {
  return (dispatch) => {
    fetch(`${APICONFIG.apiBaseUrl}/api/Account/ChangePassword`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: APICONFIG.apiHeaders(),
    })
      .then(async (response) => {
        // console.log(response);
        if (response.status === 200 && response.ok) {
          // await response.json().then((result) => {
          // console.log(result)
          let psetting = {
            tried: true,
            customMessage: false,
            successFlag: true,
            status: 'Password Changed Successfully.',
          };
          dispatch({
            type: 'PASSWORD_CHANGED',
            payload: psetting,
          });
          window.Mixpanel.MixpanelProps.UserName = APICONFIG.apiLoggedInUser();
          window.Mixpanel.MixpanelProps.PasswordChangedAt = moment().format('DD/MM/YYYY HH:mm:s A');
          window.Mixpanel.actions.identify(APICONFIG.apiLoggedInUser());

          window.Mixpanel.actions.track(`User Password Changed`, window.Mixpanel.MixpanelProps).then((data) => {
            window.Mixpanel.actions.people.set({
              UserName: APICONFIG.apiLoggedInUser(),
            });
          });
          // });
        } else {
          await response.json().then((result) => {
            let ModelStateKeys = Object.keys(result.ModelState);
            console.log(result, result.ModelState, ModelStateKeys);
            let customMessage = false;
            if (result.ModelState[ModelStateKeys[0]][0].toLowerCase().includes('passwords must have')) {
              customMessage = 'PASSMUSTHAVESERROR';
            } else if (
              result.ModelState[ModelStateKeys[0]][0].toLowerCase().includes('incorrect password') ||
              result.ModelState[ModelStateKeys[0]][0].toLowerCase().includes('current password')
            ) {
              customMessage = 'INCORRECTPASSERROR';
            }
            let psetting = {
              tried: true,
              customMessage,
              successFlag: false,
              status: `${result.ModelState[ModelStateKeys[0]][0]}`,
            };
            dispatch({
              type: 'PASSWORD_CHANGED',
              payload: psetting,
            });
          });
        }
      })
      .catch((err) => {
        // console.log(err)
        let data = {
          username: APICONFIG.apiLoggedInUser(),
          action: 'Change Password',
          url: `${APICONFIG.apiBaseUrl}/api/Account/ChangePassword`,
          severity: 'low',
        };
        dispatch({
          type: 'REQUEST_ERROR',
          payload: ErrorHandleHelper.generateErrorString(err, 'ChangePass'),
          data: data,
        });
      });
  };
}

export function setNotificationsForMessage(notif) {
  return (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATIONS',
      payload: notif,
    });
    dispatch({
      type: 'SET_INCMESSAGE',
      payload: [],
    });
  };
}

export function resetNotifications() {
  return (dispatch) => {
    let notif = {
      has: false,
      title: 'Crowdsense Notification',
      body: '',
    };
    dispatch({
      type: 'SET_NOTIFICATIONS',
      payload: notif,
    });
  };
}

export function activateGlobalTooltipRemover() {
  return (dispatch) => {
    dispatch({
      type: 'TTR_GLOBAL_ACTIVATE',
    });
  };
}
export function deactivateGlobalTooltipRemover() {
  return (dispatch) => {
    dispatch({
      type: 'TTR_GLOBAL_DEACTIVATE',
    });
  };
}

export function getTimeZoneList() {
  return (dispatch) => {
    fetch(`${APICONFIG.apiBaseUrl}/api/userpreferences/gettimezoneslist`, {
      method: 'GET',
      headers: APICONFIG.apiHeaders(),
    })
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          let utcOffset = element.Time.substring(result[0].Time.lastIndexOf('(') + 1, result[0].Time.lastIndexOf(')'));
          utcOffset = utcOffset.replace('UTC', '');
          element.UTCOffset = utcOffset;
        });
        dispatch({
          type: 'SET_TZ_LIST',
          payload: result,
        });
      })
      .catch((err) => {
        let data = {
          username: APICONFIG.apiLoggedInUser(),
          action: 'Get Time Zone List',
          url: `${APICONFIG.apiBaseUrl}/api/userpreferences/gettimezoneslist`,
          severity: 'low',
        };
        console.log(err);
        dispatch({
          type: 'REQUEST_ERROR',
          payload: ErrorHandleHelper.generateErrorString(err, 'getTimeZoneList'),
          data: data,
        });
      });
  };
}

export function getTickerIconsList(url) {
  return (dispatch) => {
    if (url) {
      fetch(url)
        .then((response) => response.text())
        .then((result) => {
          let iconList = [];
          if (result) {
            iconList = result.split(';');
          }
          dispatch({
            type: 'SET_TICKER_ICON_LIST',
            payload: iconList,
          });
        })
        .catch((err) => {
          let data = {
            username: APICONFIG.apiLoggedInUser(),
            action: 'Get Icon List',
            url,
            severity: 'low',
          };
          dispatch({
            type: 'REQUEST_ERROR',
            payload: ErrorHandleHelper.generateErrorString(err, 'getTickerIconsList'),
            data: data,
          });
        });
    }
  };
}

export function reportLogin() {
  return (dispatch) => {
    fetch(`${APICONFIG.apiBaseUrl}/api/userpreferences/reportlogin?userName=${APICONFIG.apiLoggedInUser()}`, {
      method: 'GET',
      headers: APICONFIG.apiHeaders(),
    });
  };
}

export function closeVerifyEmailBox(status) {
  return (dispatch) => {
    dispatch({
      type: 'EMAILVERIFIEDSTATUS',
      payload: status,
    });
  };
}

export function resendEmailVerification() {
  return (dispatch) => {
    // console.log('here')

    fetch(`${APICONFIG.apiBaseUrl}/api/Account/SentEmailVerification?userName=${APICONFIG.apiLoggedInUser()}`, {
      method: 'GET',
      headers: APICONFIG.apiHeaders(),
    })
      .then(async (response) => {
        let result = await response.json();
        console.log(result);
        if (result === 'Success') {
          dispatch({
            type: 'EMAILVERIFIEDSTATUS',
            payload: true,
          });
        } else {
          throw new Error('Resend Verification Email Failed.');
        }
      })
      .catch((err) => {
        let data = {
          username: APICONFIG.apiLoggedInUser(),
          action: 'Resend Verification Email',
          url: `${APICONFIG.apiBaseUrl}/api/Account/SentEmailVerification?userName=${APICONFIG.apiLoggedInUser()}`,
          severity: 'low',
        };
        console.log(err);
        dispatch({
          type: 'REQUEST_ERROR',
          payload: ErrorHandleHelper.generateErrorString(err, 'resendEmailVerification'),
          data: data,
        });
      });
  };
}

export function closePremiumBanner() {
  return (dispatch) => {
    dispatch({
      type: 'CLOSE_THE_PREMIUM_BANNER',
      payload: false,
    });
  };
}

export function togglePro() {
  return (dispatch) => {
    let userData = JSON.parse(window.localStorage.getItem('userData'));
    // console.log(userData.isPro)
    userData.isPro = !userData.isPro;
    // console.log(userData.isPro)
    window.sessionStorage.setItem('isProFlag', userData.isPro);
    window.localStorage.setItem('userData', JSON.stringify(userData));
    dispatch({
      type: 'TOGGLE_PRO',
      payload: userData.isPro,
    });
  };
}

export function setNotificationId(token) {
  return (dispatch) => {
    // console.log('here')

    fetch(`${APICONFIG.apiBaseUrl}/api/Account/SetNotificationID`, {
      method: 'POST',
      body: JSON.stringify({
        UserName: APICONFIG.apiLoggedInUser(),
        UserPreferencesString: token
      }),
      headers: APICONFIG.apiHeaders(),
    })
      .then(async (response) => {
        let result = await response.json();
        // console.log(result);

      })
      .catch((err) => {
        let data = {
          username: APICONFIG.apiLoggedInUser(),
          action: 'Set NotificationId',
          url: `${APICONFIG.apiBaseUrl}/api/Account/SetNotificationID`,
          severity: 'low',
        };
        console.log(err);
        dispatch({
          type: 'REQUEST_ERROR',
          payload: ErrorHandleHelper.generateErrorString(err, 'SetNotificationId'),
          data: data,
        });
      });
  };
}

export function setFreeTrial() {
  return (dispatch) => {

    fetch(`${APICONFIG.apiBaseUrl}/api/userpreferences/settrial?userName=${APICONFIG.apiLoggedInUser()}`, {
      method: 'GET',
      headers: APICONFIG.apiHeaders(),
    })
      .then(async (response) => {
        let result = await response.json();
        console.log(result);
        let freetrial = false;
        let freetrialdetails = {
          trialEndDate: '',
          daystogo: 0
        }
        if (result !== '1/1/0001 12:00:00 AM') {
          let now = moment();
          let tmpFr = result;
          // console.log(tmpFr.split(' ')[0].replace(/\//g, "."))
          let date = tmpFr.split(' ')[0];
          let formattedDate = `${date.split('/')[1]}.${date.split('/')[0]}.${date.split('/')[2]}`
          let trialExpiryDate = moment(tmpFr.split(' ').length ? formattedDate : '', 'DD.MM.YYYY');

          let daystogo = trialExpiryDate.isValid() ? trialExpiryDate.diff(now, 'days') + 1 : 0;
          freetrial = true;
          freetrialdetails = {
            trialEndDate: tmpFr.split(' ').length ? formattedDate : '',
            daystogo
          }
          console.log(freetrialdetails)
          dispatch({
            type: 'SETFREETRIAL',
            payload: {
              freeTrial: freetrial,
              freeTrialDetails: freetrialdetails
            },
          });
        } else {
          throw new Error('Set Free Trial Failed.');
        }


      })
      .catch((err) => {
        let data = {
          username: APICONFIG.apiLoggedInUser(),
          action: 'Set Free Trial',
          url: `${APICONFIG.apiBaseUrl}/api/userpreferences/settrial?userName=${APICONFIG.apiLoggedInUser()}`,
          severity: 'low',
        };
        console.log(err);
        dispatch({
          type: 'REQUEST_ERROR',
          payload: ErrorHandleHelper.generateErrorString(err, 'setFreeTrial'),
          data: data,
        });
      });
    // dispatch({
    //   type: 'FROM_MOBILEAPP',
    //   payload: state,
    // });
  }
}

export function setMobileApp(state) {
  return (dispatch) => {
    dispatch({
      type: 'FROM_MOBILEAPP',
      payload: state,
    });
  }
}
export function installedAppData(data) {
  return (dispatch) => {
    dispatch({
      type: 'INSTALLED_APP_DATA',
      payload: data,
    });
  }
}
export function welcomemodeon(stat) {
  return (dispatch) => {
    dispatch({
      type: 'WELCOME_MODE_ON',
      payload: stat
    });
  }
}
export function maintenancemode(stat) {
  return (dispatch) => {
    dispatch({
      type: 'MAINTENANCE_MODE',
      payload: stat
    });
  }
}
export function updateActiveColumn(Column, Before, After) {
  return (dispatch) => {
    dispatch({
      type: 'ACTIVE_COLUMN',
      payload: Column,
      before: Before,
      after: After
    });
  }
}
export function SetPostponeUpdate(status) {
  return (dispatch) => {
    dispatch({
      type: 'SET_POSTPONEUPDATE',
      payload: status
    });
  }
}

export function setcolumnlist(data) {
  return (dispatch) => {
    dispatch({
      type: 'SET_COLUMN_LIST',
      payload: data
    })
  }
}
export function initiallysetcolumnorderlist(data) {
  return (dispatch) => {
    dispatch({
      type: 'SET_COLUMN_ORDER_LIST_INIT',
      payload: data
    })
  }
}
export function verifiednewsettings(data) {
  return (dispatch) => {
    dispatch({
      type: 'SET_VERIFIED_SETTING',
      payload: data
    })
  }
}

export function switchcolumnfocus(ColumnName) {
  return (dispatch) => {
    dispatch({
      type: 'SWITCH_COLUMN_FOCUS',
      payload: ColumnName,
    });
  }
}
export function updatepinnedmainfeeds() {
  return (dispatch) => {
    dispatch({
      type: 'PINNED_MAINFEEDS',
    });
  }
}
export function updateclosedpinnedcolumn() {
  return (dispatch) => {
    dispatch({
      type: 'CLOSE_PINNED_COLUMNS',
    });
  }
}
export function UpdateInitialColumnLoadCounter() {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_LOADCOUNTER',
    });
  }
}
export function DisableLoader() {
  return (dispatch) => {
    dispatch({
      type: 'DISABLE_APPLOADING',
    });
  }
}
export function EnableLoader() {
  return (dispatch) => {
    dispatch({
      type: 'ENABLE_APPLOADING',
    });
  }
}
