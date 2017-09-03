import axios from 'axios';

const proxy = '';

const isEmptyObject = (e) => {
  for (const t in e) {
    if (t) {
      return false;
    }
  }
  return true;
};

const fetch = (options) => {
  const {
    method = 'post',
    url,
    data,
  } = options;
  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(`${proxy}${url}`, {
        params: data,
      });
    case 'post': {
      const formData = new FormData();
      for (const name in data) {
        if ({}.hasOwnProperty.call(data, name)) {
          let param = data[name];
          if (param) {
            if (typeof param === 'object') {
              if (!isEmptyObject(param)) {
                param = JSON.stringify(data[name]);
                formData.append(name, param);
              }
            } else {
              formData.append(name, param);
            }
          }
        }
      }
      return axios.post(`${proxy}${url}`, formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    }
    default:
      return axios(options);
  }
};

export default function request(options) {
  return fetch(options).then((response) => {
    return response.data;
    // const { statusText, status } = response
    // return {
    //   success: true,
    //   message: statusText,
    //   statusCode: status,
    //   data: response.data,
    // };
  }).catch((error) => {
    const { response } = error;
    let msg;
    let statusCode;
    if (response && response instanceof Object) {
      const { data, statusText } = response;
      statusCode = response.status;
      msg = data.message || statusText;
    } else {
      statusCode = 600;
      msg = error.message || 'Network Error';
    }
    return { success: false, statusCode, message: msg };
  });
}
