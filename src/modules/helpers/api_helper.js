import Store from '../../store';

export const apiBaseUrl = Store.getState().settings.api.apiBaseUrl;
export const apiHeaders = () => {
  return Store.getState().settings.api.apiRequestHeaders.headers;
};

