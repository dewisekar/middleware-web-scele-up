const axios = require('axios');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const { poolPromise } = require('../utility/database');
const { TIKTOK_QUERIES } = require('../queries/tiktok');

const headers = {
  authority: 'tiktok.livecounts.io',
  origin: 'https://livecounts.io',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  referer: 'https://www.tiktok.com/',
  cookie: 'tt_webid_v2=BOB'
};

const parseShortTiktokUrl = async (url) => {
  const axiosResponse = await axios.request({
    method: 'GET',
    url,
    headers
  });
  const { path } = axiosResponse.request;
  return `https://www.tiktok.com${path}`;
};

const getUserInfoByUsername = async (username) => {
  const axiosResponse = await axios.request({
    method: 'GET',
    url: `https://tiktok.livecounts.io/user/search/${username}`,
    headers
  });
  const userInfo = axiosResponse.data.userData[0];
  const { stats } = userInfo;

  return stats;
};

const _getVideoStatistic = async (videoId) => {
  const axiosResponse = await axios.request({
    method: 'GET',
    url: `https://tiktok.livecounts.io/video/stats/${videoId}`,
    headers
  });

  return axiosResponse.data;
};

const _getVideoInfo = async (videoId) => {
  const axiosResponse = await axios.request({
    method: 'GET',
    url: `https://tiktok.livecounts.io/video/data/${videoId}`,
    headers
  });

  return axiosResponse.data;
};

const _getUserStatisticById = async (userId) => {
  const axiosResponse = await axios.request({
    method: 'GET',
    url: `https://tiktok.livecounts.io/user/stats/${userId}`,
    headers
  });

  return axiosResponse.data;
};

const _getUserStatistic = async (username) => {
  const axiosResponse = await axios.request({
    method: 'GET',
    url: `https://www.tiktok.com/${username}`,
    headers
  });

  const page = axiosResponse.data.toString();
  const dom = new JSDOM(page);
  const sigiState = dom.window.document.querySelector('#SIGI_STATE').textContent;
  const { UserModule: { stats } } = JSON.parse(sigiState);
  const userStats = stats[username.split('@')[1]];

  return userStats;
};

const _getUserVideos = async (username, costPerSlot, totalPost = 10) => {
  const axiosResponse = await axios.request({
    method: 'GET',
    url: `https://www.tiktok.com/@${username}`,
    headers
  });
  let totalViews = 0;
  const totalPrice = costPerSlot * totalPost;

  const page = axiosResponse.data.toString();
  const dom = new JSDOM(page);
  const sigiState = dom.window.document.querySelector('#SIGI_STATE').textContent;
  const { ItemModule } = JSON.parse(sigiState);
  const keys = Object.keys(ItemModule);

  const videos = [];

  // eslint-disable-next-line no-plusplus
  for (let j = 0; j < totalPost; j++) {
    const key = keys[j];
    const { stats } = ItemModule[key];
    const { playCount } = stats;
    totalViews += playCount;
    const cpm = (costPerSlot / playCount) * 1000;

    videos.push({ ...stats, id: key, cpm });
  }
  const avgCpm = (totalPrice / totalViews) * 1000;
  const avgViews = totalViews / totalPost;

  return {
    totalViews, avgCpm, avgViews, videos
  };
};

const _getVideoStatisticFromTiktokPage = async (videoId, url) => {
  const axiosResponse = await axios.request({
    method: 'GET',
    url,
    headers
  });
  const page = axiosResponse.data.toString();
  const dom = new JSDOM(page);
  const sigiState = dom.window.document.querySelector('#SIGI_STATE').textContent;
  const { ItemModule } = JSON.parse(sigiState);
  const { stats } = ItemModule[videoId];
  const {
    diggCount: likeCount, shareCount, commentCount, playCount: viewCount
  } = stats;

  return {
    likeCount, shareCount, commentCount, viewCount
  };
};

const getVideoAndUserStatistic = async (url) => {
  try {
    let finalUrl = url;

    if (!url.includes('@')) {
      finalUrl = await parseShortTiktokUrl(url);
    }
    const regex = finalUrl.split('/');
    const uncutId = regex[5].split('?');
    const videoId = uncutId[0];
    const username = regex[3];

    const video = await _getVideoStatisticFromTiktokPage(videoId, finalUrl);
    const user = await _getUserStatistic(username);

    return {
      message: {
        video,
        user
      },
      status: true
    };
  } catch (error) {
    console.log('error in fetching video stats:', error);
    return { status: false };
  }
};

const getUserCpmByCost = async (username, costPerSlot) => {
  try {
    const { videos, ...otherInfo } = await _getUserVideos(username, costPerSlot);
    const { followerCount } = await _getUserStatistic(`@${username}`);
    const minCpm = Math.min(...videos.map((item) => item.cpm));
    const minViews = Math.min(...videos.map((item) => item.playCount));
    const maxCpm = Math.max(...videos.map((item) => item.cpm));
    const maxViews = Math.max(...videos.map((item) => item.playCount));

    const pool = await poolPromise;
    await pool
      .request()
      .input('username', username)
      .input('followers', followerCount)
      .input('totalViews', otherInfo.totalViews)
      .input('costPerSlot', costPerSlot)
      .input('avgCpm', otherInfo.avgCpm)
      .input('avgViews', otherInfo.avgViews)
      .input('maxCpm', maxCpm)
      .input('minCpm', minCpm)
      .input('minViews', minViews)
      .input('maxViews', maxViews)
      .input('status', 'PENDING')
      .query(TIKTOK_QUERIES.INSERT_KOL_LISTING);

    const data = {
      ...otherInfo, costPerSlot, username, minCpm, minViews, maxCpm, maxViews, followerCount
    };

    return { status: true, message: data };
  } catch (error) {
    console.log('error in fetching video stats:', error);
    return { status: false, error: error.response.status };
  }
};

const fetchKolListing = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(TIKTOK_QUERIES.FETCH_KOL_LISTING);
    const { recordset } = result;

    return {
      status: true,
      message: recordset
    };
  } catch (error) {
    console.log('error fetchKolListing" ', error);
    return { status: false, error: error.response.status };
  }
};

const approveListing = async (id, payload) => {
  const resp = { status: 'false' };
  console.log('haloooo');
  try {
    const { status } = payload;
    const pool = await poolPromise;
    console.log('hal', id, payload);
    const result = await pool
      .request()
      .input('id', id)
      .input('status', status)
      .query(TIKTOK_QUERIES.APPROVE_LISTING);
    resp.status = 'true';
    resp.message = result.recordset;

    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  getUserInfoByUsername,
  parseShortTiktokUrl,
  getVideoAndUserStatistic,
  getUserCpmByCost,
  fetchKolListing,
  approveListing
};
