/*
 JSON 数据加载
*/

/**
 * 自定义数据key
 * @type {string}
 */
const keyName = 'custom-data-token';

/**
 * 加载数据
 * @param callback 加载成功处理
 * @param errHandler 加载失败处理
 */
const load = (url, callback, errHandler) => {
  if (window.localStorage && window.localStorage.getItem(keyName)) {
    return commonLoad(url, callback, errHandler, window.localStorage.getItem(keyName));
  } else {
    return corsLoad(url, callback, errHandler);
  }
};

const corsLoad = (url, callback, errHandler) => {
  const newCallBack = function (result) {
    window.localStorage.setItem(keyName, result.token);
    callback(result);
  };
  return sendRequest(newCallBack, errHandler, url);
};

const commonLoad = (url, callback, errHandler, token) => {
  return sendRequest(callback, errHandler, url + '?token=' + token);
};

const sendRequest = (callback, errHandler, apiUrl) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', apiUrl);
  xhr.withCredentials = true;
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      let data = xhr.responseText
        ? JSON.parse(xhr.responseText)
        : { errMessage: '无法获取数据(' + apiUrl + ')，请检查网络连接，正为您显示本地诗词...' };
      if (data.status === 'success') {
        callback(data);
      } else {
        if (errHandler) {
          errHandler(data);
        } else {
          console.error('自定义数据API' + apiUrl + '加载失败，错误原因：' + data.errMessage);
        }
      }
    }
  };
};

export { load };
