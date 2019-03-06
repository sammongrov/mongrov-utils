/**
 * Test to check if utils is working as expected
 */
/* global it expect jest */
import moment from 'moment';
import dns from 'dns.js';
import { Colors } from '@ui/theme_default';
import { Config } from '@appConfig';
import AppUtil from '../index';

const mockMath = global.Math;
mockMath.random = () => 0.5;
global.Math = mockMath;

jest.spyOn(Date, 'now').mockImplementation(() => 1549029907038);
jest.mock('@appConfig', () => ({
  Config: {
    brand: 'server.com',
    setBrand: jest.fn(),
  },
}));
jest.mock('dns.js', () => ({
  resolve: jest.fn(),
}));

/*   Remove empty values from a given associative array */
it('removeEmptyValues', () => {
  var obj = null;
  var res = AppUtil.removeEmptyValues(obj);
  expect(AppUtil.objIsEmpty(res)).toBeTruthy();

  obj = { a: null, b: null, c: null };
  res = AppUtil.removeEmptyValues(obj);
  expect(AppUtil.objIsEmpty(res)).toBeTruthy();

  obj = { a: 'a', b: null, c: null };
  res = AppUtil.removeEmptyValues(obj);
  expect(res).toEqual({ a: 'a' });

  obj = { a: 'a', b: null, c: null };
  obj.d = undefined;
  obj.e = undefined;
  res = AppUtil.removeEmptyValues(obj);
  expect(res).toEqual({ a: 'a' });
});

it('objIsEmpty', () => {
  var obj = null;
  var res = AppUtil.objIsEmpty(obj);
  expect(res).not.toBeTruthy();

  obj = {};
  res = AppUtil.objIsEmpty(obj);
  expect(res).toBeTruthy();

  obj = [];
  res = AppUtil.objIsEmpty(obj);
  expect(res).not.toBeTruthy();

  obj = { a: 5 };
  res = AppUtil.objIsEmpty(obj);
  expect(res).not.toBeTruthy();
});

it('limitChars', () => {
  var str = null;
  var res = AppUtil.limitChars(str);
  expect(res).toBeNull();

  str = 'HelloHelloHello';
  res = AppUtil.limitChars(str);
  expect(res).toEqual(str);

  str = 'HelloHelloHelloA';
  res = AppUtil.limitChars(str);
  expect(res).not.toEqual(str);
  expect(res).toHaveLength(15 + 4);

  str = 'HelloHelloHelloA';
  res = AppUtil.limitChars(str, 5);
  expect(res).not.toEqual(str);
  expect(res).toHaveLength(5 + 4);
});

it('Strips all HTML tags', () => {
  var str = 'Hello <b>world!</b>';
  var res = AppUtil.stripTags(str);
  expect(res).not.toEqual(str);

  str = 'Hello world!';
  res = AppUtil.stripTags(str);
  expect(res).toEqual(str);
});

it('avatarInitials', () => {
  var str = '';
  var res = AppUtil.avatarInitials(str);
  expect(res).toEqual(str);

  str = 'john';
  res = AppUtil.avatarInitials(str);
  expect(res).toEqual('J');

  str = 'joel John';
  res = AppUtil.avatarInitials(str);
  expect(res).not.toEqual(str);
});

it('convert object to array', () => {
  var obj = { a: 'a', b: 'b', c: 'c' };
  var res = AppUtil.objToArr(obj);
  expect(res).not.toMatchObject(obj);
});
it('websocket', () => {
  var url = 'mongrov';
  var res = AppUtil.websocketUrl(url);
  expect(res).toEqual(`wss://${url}/websocket`);
});
it('setDebugMode', () => {
  var mode = true;
  AppUtil.setDebugMode(mode);
  expect(process.env.NODE_ENV).toBeTruthy();
});

it('debug test', () => {
  var str = null;
  var title = null;
  AppUtil.debug(str, title);
  // nothing to expect here
  title = 'hello';
  AppUtil.debug(str, title);
  title = null;
  str = 'body here';
  AppUtil.debug(str, title);
  title = 'app details';
  str = { id: 5, val: 'hello' };
  AppUtil.debug(str, title);
});

it('format date test', () => {
  const todaysDate = moment().subtract(20, 'minutes');
  const prevDay = moment().subtract(1, 'days');
  const prevWeek = moment()
    .subtract(7, 'days')
    .format('DD/MM/YYYY');
  const nullRes = AppUtil.formatDate();
  const todayRes = AppUtil.formatDate(todaysDate);
  const prevRes = AppUtil.formatDate(prevDay);
  const weekRes = AppUtil.formatDate(prevWeek);
  const weekResFormat = moment(weekRes).format('DD/MM/YYYY');
  const todayCompare = moment(todaysDate).format('hh:mm A');
  const prevCompare = 'Yesterday';
  const weekCompare = moment(weekRes).format('DD/MM/YYYY');
  expect(nullRes).toMatch('');
  expect(todayRes).toMatch(todayCompare);
  expect(prevRes).toMatch(prevCompare);
  expect(weekResFormat).toMatch(weekCompare);
});
it('format date test', () => {
  const todaysDate = moment().subtract(20, 'minutes');
  const prevDay = moment().subtract(1, 'days');
  const prevWeek = moment()
    .subtract(7, 'days')
    .format('DD/MM/YYYY');
  const nullRes = AppUtil.formatNewsDate();
  const todayRes = AppUtil.formatNewsDate(todaysDate);
  const prevRes = AppUtil.formatNewsDate(prevDay);
  const weekRes = AppUtil.formatNewsDate(prevWeek);
  const weekResFormat = moment(weekRes).format('DD/MM/YYYY');
  const todayCompare = moment(todaysDate).format('hh:mm A');
  const prevCompare = 'Yesterday';
  const weekCompare = moment(weekRes).format('DD/MM/YYYY');
  expect(nullRes).toMatch('');
  expect(todayRes).toMatch(todayCompare);
  expect(prevRes).toMatch(prevCompare);
  expect(weekResFormat).toMatch(weekCompare);
});

it('Converts integer to hex test', () => {
  expect(AppUtil.colToHex(1)).toEqual('4c');
});

it('Converts rgb to hex test', () => {
  expect(AppUtil.rgbToHex(85, 85, 85)).toEqual('#555555');
});

it('getting random colors test', () => {
  expect(AppUtil.getRandomColor()).toMatch('#7f7f7f');
});

it('avatarInitialsHash', () => {
  var str = '';
  var res = AppUtil.avatarInitialsHash(str);
  expect(res).toEqual(str);

  str = 'john';
  res = AppUtil.avatarInitialsHash(str);
  expect(res).toEqual('J');

  str = 'joel John';
  res = AppUtil.avatarInitialsHash(str);
  expect(res).not.toEqual(str);
});

it('capitalizeString', () => {
  // empty string
  expect(AppUtil.capitalizeString('')).toMatch('');
  // undefined
  expect(AppUtil.capitalizeString()).toBeUndefined();
  // null
  expect(AppUtil.capitalizeString(null)).toBeNull();
  // number
  expect(AppUtil.capitalizeString(123456)).toMatch('123456');
  // string in lowercase
  expect(AppUtil.capitalizeString('super user')).toMatch('Super User');
  // capitalized string
  expect(AppUtil.capitalizeString('incredibly Super user')).toMatch('Incredibly Super User');
});

it('getAvatarColor', () => {
  const userName = 'test';
  expect(AppUtil.getAvatarColor()).toMatch(Colors.PRIMARY);
  expect(AppUtil.getAvatarColor(userName)).toMatch(
    `#${AppUtil.intToRGB(AppUtil.hashCode(userName))}`,
  );
});

it('hashCode', () => {
  const userName = 'test';
  expect(AppUtil.hashCode(userName)).toBeTruthy();
});

it('intToRGB', () => {
  const number = 3556498;
  expect(AppUtil.intToRGB(number)).toBeTruthy();
});

it('createGuid', () => {
  const strLength = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.length;
  const guid = AppUtil.createGuid();
  expect(guid).toBeTruthy();
  expect(guid.length).toBe(strLength);
});

it('avatarInitialsHash', () => {
  expect(AppUtil.avatarInitialsHash('test')).toMatch('T');
  expect(AppUtil.avatarInitialsHash('Java script')).toMatch('JS');
  expect(AppUtil.avatarInitialsHash('first SECOND tHird')).toMatch('FST');
  expect(AppUtil.avatarInitialsHash('0')).toMatch('0');
});

it('asyncForEach', async () => {
  const callback = jest.fn();
  expect.assertions(2);
  await AppUtil.asyncForEach([], callback);
  await AppUtil.asyncForEach([1, 2, 3], callback);
  expect(callback.mock.calls.length).toBe(3);
  expect(callback).toBeCalledWith(2, 1, [1, 2, 3]);
});

it('getCurrentRealmDate', () => {
  expect(AppUtil.getCurrentRealmDate()).toEqual(expect.any(Date));
});

it('serverChange', () => {
  let serverName = 'DEMO.Mongrov.COM';
  expect(AppUtil.serverChange(serverName)).toMatch(serverName.toLowerCase());
  serverName = 'office';
  expect(AppUtil.serverChange(serverName)).toMatch(`${serverName}.${Config.brand}`);
  serverName = '12Y>,IO{';
  expect(AppUtil.serverChange(serverName)).toBeUndefined();
  serverName = 'd.e.M.O. mon7,grov.!com';
  expect(AppUtil.serverChange(serverName)).toBeUndefined();
});

it('checkHostName', async () => {
  const error = new Error('host resolution error');
  const emptyRecords = [];
  const nonEmptyRecords = ['192.161.255.2', '173.117.25.1'];
  const hostname1 = '123.567.com';
  const hostname2 = 'demo.mongrov.com';
  const hostname3 = 'paradise.mongrov.com';
  dns.resolve = jest.fn((str, cb) => cb(error, null));
  const result1 = await AppUtil.checkHostName(hostname1);
  expect(result1).toMatch('CheckConnection');

  dns.resolve = jest.fn((str, cb) => cb(null, nonEmptyRecords));
  const result2 = await AppUtil.checkHostName(hostname2);
  expect(result2).toBe(true);

  dns.resolve = jest.fn((str, cb) => cb(null, emptyRecords));
  const result3 = await AppUtil.checkHostName(hostname3);
  expect(result3).toBe(false);
});
