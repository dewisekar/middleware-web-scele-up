const axios = require("axios");

const { WA_URL } = require("../config");
const headers = { "Content-Type": "application/json" };

const sendMessage = async (payload) => {
  let resp = { status: "false" };
  const url = WA_URL + "/send-message";

  try {
    const res = await axios.post(url, payload, {
      headers,
    });

    if (res.data.data !== "undefined") {
      let data = res.data.data;
      resp.message = data;
      resp.status = "true";
    }

    return resp;
  } catch (error) {
    console.log(error)
    return error;
  }
};

module.exports = { sendMessage };
