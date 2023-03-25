const axios = require('axios');
const { poolPromise } = require('../utility/database');

const headers = {
  authority: 'tiktok.livecounts.io',
  origin: 'https://livecounts.io',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
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

const getVideoAndUserStatistic = async (url) => {
  try {
    let finalUrl = url;

    if (!url.includes('@')) {
      finalUrl = await parseShortTiktokUrl(url);
    }
    const regex = finalUrl.split('/');
    const uncutId = regex[5].split('?');
    const videoId = uncutId[0];

    const videoStatistic = await _getVideoStatistic(videoId);
    const { author } = await _getVideoInfo(videoId);
    const { userId } = author;
    const userStatistic = await _getUserStatisticById(userId);

    return {
      message: {
        author,
        video: videoStatistic,
        user: userStatistic
      },
      status: true
    };
  } catch (error) {
    return { status: false };
  }
};

module.exports = {
  getUserInfoByUsername,
  parseShortTiktokUrl,
  getVideoAndUserStatistic
};
