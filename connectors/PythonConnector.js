const axios = require("axios");

const { PYTHON_URL } = require("../config");
const headers = { "Content-Type": "application/json" };

const fetchPostStatistic = async (linkPost) => {
  let resp = { status: "false" };
  let data = JSON.stringify({
    video_url: linkPost,
  });
  try {
    const res = await axios.post(
      PYTHON_URL + "/getTiktokVideoWithUserStats/",
      data,
      { headers }
    );

    if (res.data.data !== "undefined") {
      let data = res.data.data;
      resp.message = data
      resp.status = "true"
    }

    return resp;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { fetchPostStatistic };
