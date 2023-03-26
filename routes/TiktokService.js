const axios = require('axios');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const { poolPromise } = require('../utility/database');

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

const _getUserVideos = async (username) => {
  const axiosResponse = await axios.request({
    method: 'GET',
    url: `https://www.tiktok.com/@${username}`,
    headers
  });

  const page = axiosResponse.data.toString();
  const dom = new JSDOM(page);
  const sigiState = dom.window.document.querySelector('#SIGI_STATE').textContent;
  const { ItemModule } = JSON.parse(sigiState);
  const keys = Object.keys(ItemModule);
  console.log(keys);

  const videos = [];

  // eslint-disable-next-line no-plusplus
  for (let j = 0; j < 10; j++) {
    const key = keys[j];
    const { stats } = ItemModule[key];
    videos.push(stats);
  }

  return videos;
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

module.exports = {
  getUserInfoByUsername,
  parseShortTiktokUrl,
  getVideoAndUserStatistic
};
