import $script_ from 'scriptjs';

let loadPromise;
export default (reloadJS = false) => {
  if (loadPromise && !reloadJS) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('map cannot be loaded outside browser env'));
      return;
    }

    if (!reloadJS && window.BMap && window.BMap.Map) {
      resolve(window.BMap.Map);
      return;
    }

    window.BMap = null;
    $script_(`http://api.map.baidu.com/getscript?v=2.0&ak=BsdrrUSaPSIpADIRCQDUsdLjXqkD9BTQ&services=&t=${new Date().getTime()}`, () => {
      if (typeof window.BMap === 'undefined') {
        reject(new Error('map initialization error (not loaded)'));
      }

      resolve(window.BMap.Map);
    });
  });
  return loadPromise;
};
