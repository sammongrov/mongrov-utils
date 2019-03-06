/**
 * Global Util Functions
 */
// Enable debug output when in Debug mode

import moment from 'moment';
import dns from 'dns.js';
import { Colors } from '@ui/theme_default';
import { Config } from '@appConfig';

let _DEBUG_MODE = process.env.NODE_ENV === 'development';

const UTIL = {
  setDebugMode: (mode) => {
    _DEBUG_MODE = mode;
  },

  /**
   * Test if Obj is empty
   */
  objIsEmpty: (obj) => {
    if (obj && typeof obj === 'object' && !(obj instanceof Array)) {
      if (Object.keys(obj).length === 0) return true;
    }
    return false;
  },

  /**
   * Remove empty values from a given associative array
   */
  removeEmptyValues: (obj) => {
    var clone = Object.assign({}, obj);
    Object.keys(clone).forEach((propName) => {
      if (clone[propName] === null || clone[propName] === undefined) {
        delete clone[propName];
      }
    });
    return clone;
  },

  websocketUrl: (url) => `wss://${url}/websocket`,

  /**
   * Convert Obj to Arr
   */
  objToArr: (obj) => Object.keys(obj).map((k) => obj[k]),

  /**
   * Limit characters, placing a ... at the end
   */
  limitChars: (str, limit = 15) => {
    if (str && str.length > limit) return `${str.substr(0, limit).trim()} ...`;
    return str;
  },

  /**
   * Debug or not to debug
   */
  debug: (str, title) => {
    if (_DEBUG_MODE && (title || str)) {
      if (title) {
        console.log(`=== DEBUG: ${title} ===========================`);
      }
      if (str) {
        console.log(str);
      }
    }
  },

  /**
   * Avatar Initials
   */
  avatarInitials: (str) => {
    var avatarStr = '';
    if (str && str.trim().length > 0) {
      const tempArr = str.split(/(\s+)/).filter((e) => e.trim().length > 0);
      avatarStr = tempArr[0].charAt(0).toUpperCase();
      // if (tempArr.length > 1) {
      //   avatarStr += tempArr[1]
      //     .trim()
      //     .charAt(0)
      //     .toUpperCase();
      // }
    }
    return avatarStr;
  },

  /**
   * Strips all HTML tags
   */
  stripTags: (str) => str.replace(/(<([^>]+)>)/gi, ''),

  formatDate: (dateObj) => {
    if (!dateObj) {
      return '';
    }
    const msgDate = moment(dateObj);
    const today = moment();
    const yesterday = moment().subtract(1, 'days');
    const diffDays = msgDate.diff(today, 'hours');
    if (diffDays > -24 && moment(msgDate).isSame(today, 'day')) {
      return moment(msgDate).format('hh:mm A');
    }
    if (moment(msgDate).isSame(moment(yesterday), 'day')) {
      return 'Yesterday';
    }
    return moment(dateObj).format('L');
  },

  formatNewsDate: (dateObj) => {
    if (!dateObj) {
      return '';
    }
    const msgDate = moment(dateObj);
    const today = moment();
    const yesterday = moment().subtract(1, 'days');
    const diffDays = msgDate.diff(today, 'hours');
    if (diffDays > -24 && moment(msgDate).isSame(today, 'day')) {
      return moment(msgDate).format('hh:mm A');
    }
    if (moment(msgDate).isSame(moment(yesterday), 'day')) {
      return 'Yesterday';
    }
    return moment(dateObj).format('D MMM YY');
  },

  /**
   * UI Utilities
   */
  // Converts integer to hex
  colToHex: (c) => {
    // Hack so colors are bright enough
    const color = c < 75 ? c + 75 : c;
    const hex = color.toString(16);
    return hex;
  },

  // uses colToHex to concatenate
  // a full 6 digit hex code
  rgbToHex: (r, g, b) => `#${UTIL.colToHex(r)}${UTIL.colToHex(g)}${UTIL.colToHex(b)}`,

  // Returns three random 0-255 integers
  getRandomColor: () =>
    UTIL.rgbToHex(
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ),

  getAvatarColor: (str) => (str ? `#${UTIL.intToRGB(UTIL.hashCode(str))}` : Colors.PRIMARY),

  hashCode: (str) => {
    var hash = 0;
    for (let i = 0; i < str.length; i += 1) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  },

  intToRGB: (i) => {
    var hex =
      ((i >> 24) & 0xff).toString(16) +
      ((i >> 16) & 0xff).toString(16) +
      ((i >> 8) & 0xff).toString(16) +
      (i & 0xff).toString(16);
    // Sometimes the string returned will be too short so we
    // add zeros to pad it out, which later get removed if
    // the length is greater than six.
    hex += '000000';
    return hex.substring(0, 6);
  },

  createGuid: () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }),

  avatarInitialsHash: (name) => name.replace(/\W*(\w)\w*/g, '$1').toUpperCase(),

  /* eslint-disable no-await-in-loop */
  asyncForEach: async (array, callback) => {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  },

  // capitalize every word in a string
  capitalizeString: (text) => {
    if (text) {
      return text
        .toString()
        .split(' ')
        .map((elem) => elem[0].toUpperCase() + elem.slice(1))
        .join(' ');
    }
    return text;
  },

  getCurrentRealmDate() {
    const nowDate = new Date();
    return new Date(
      nowDate.getFullYear(),
      nowDate.getMonth(),
      nowDate.getDate(),
      nowDate.getHours(),
      nowDate.getMinutes(),
      nowDate.getSeconds(),
      nowDate.getMilliseconds(),
    );
  },

  serverChange: (serverName) => {
    const serverUrl = serverName;
    const instanceUrl = serverUrl.trim().toLowerCase();
    const noOfDots = (instanceUrl.match(/\./g) || []).length;
    // const regexp = /^(?!\.)(?!.*\.$)(?!.*?\.\.)[a-zA-Z0-9.]+$/;

    /* eslint-disable */
    // valid hostname regex per RFC 1123
    const validHostNameRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gm;
    /* eslint-disable */

    let resetInstanceUrl = '';
    let instanceIp = instanceUrl; // x.y.m.com
    let brandIp = Config.brand;

    if (noOfDots <= 1) {
      resetInstanceUrl = `${instanceIp}.${brandIp}`;
      if (validHostNameRegex.test(resetInstanceUrl)) {
        return resetInstanceUrl;
      }
    } else {
      const res = instanceUrl.split('.'); // [x,y,m,com]
      [instanceIp] = res; // x
      let i;
      let newInstanceIp = '';
      for (i = 1; i < res.length; i += 1) {
        newInstanceIp = `${newInstanceIp}.${res[i]}`; // .m.com
      }
      brandIp = `${res[res.length - 2]}.${res[res.length - 1]}`; // m.com
      instanceIp = instanceUrl.replace(`.${brandIp}`, '');
      resetInstanceUrl = instanceUrl;
      if (validHostNameRegex.test(resetInstanceUrl)) {
        Config.setBrand(brandIp);
        return resetInstanceUrl;
      }
    }
  },

  checkHostName: (hostName) =>
    new Promise((resolve, reject) => {
      dns.resolve(hostName, (err, records) => {
        if (err) reject(err);
        resolve(records);
      });
    })
      .then((records) => records.length > 0)
      .catch((error) => {
        // console.log(`ERROR RESOLVING HOST NAME, ${JSON.stringify(error)}`);
        return 'CheckConnection';
      }),
};

/* Export ==================================================================== */
export default UTIL;
