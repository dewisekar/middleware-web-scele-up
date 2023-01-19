const axios = require("axios");
const nodemailer = require("nodemailer");

const { poolPromise } = require("../utility/database");
const { sendToTheQueue } = require("../utility/rabbitmq");
const { PYTHON_URL } = require("../config");
const { QUERIES } = require("../queries/index");
const PythonConnector = require("../connectors/PythonConnector");
const { upload } = require("../utility/multer");

const sendEmail = async (receiverEmail, subject, content) => {
  let response = "failed";
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jiera.fullstack@gmail.com",
      pass: "aqqnedeocsegjhlp",
    },
  });

  await transporter.verify().then(console.log).catch(console.error);
  await transporter
    .sendMail({
      from: '"Jiera Fullstack" <jiera.fullstack@gmail.com>', // sender address
      to: receiverEmail, //"receiverone@gmail.com, receivertwo@outlook.com", // list of receivers
      subject: subject, //"Medium @edigleyssonsilva ✔", // Subject line
      text: content, //"There is a new article. It's about sending emails, check it out!", // plain text body
      //html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
    })
    .then((info) => {
      console.log("transporter send email", { info });
      response = "success";
    })
    .catch(console.error);
  return response;
};

const sendMessageToQueue = async (req) => {
  let resp = { status: "false" };
  let queue_name = req.Queue;
  let message = req.Message;
  try {
    let status = await sendToTheQueue(queue_name, message);
    if (status) resp.status = "true";
  } catch (err) {
    console.error(err);
  }
  return resp;
};

const procToSendEmail = async (req) => {
  let resp = { status: "false" };
  try {
    let receiverEmail = req.receiverEmail;
    let subject = req.subject;
    let content = req.content;
    let response = await sendEmail(receiverEmail, subject, content);
    console.log("sendEmail response:", response);
    if (response == "success") {
      resp.status = "true";
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};
const insertNewKOL = async (req) => {
  let resp = { status: "false" };
  try {
    let JenisEndorse = req.JenisEndorse;
    let JenisPlatform = req.JenisPlatform;
    let KategoriKOL = req.KategoriKOL;
    let NamaKOL = req.NamaKOL;
    let UsernameKOL = req.UsernameKOL;
    let NoWhatsapp = req.NoWhatsapp;
    let AlamatKOL = req.AlamatKOL;
    let NorekKOL = req.NorekKOL;
    let KTP = req.KTP;
    let Bank = req.Bank;
    let User = req.User;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("JenisEndorse", JenisEndorse)
      .input("JenisPlatform", JenisPlatform)
      .input("KategoriKOL", KategoriKOL)
      .input("NamaKOL", NamaKOL)
      .input("UsernameKOL", UsernameKOL)
      .input("NoWhatsapp", NoWhatsapp)
      .input("AlamatKOL", AlamatKOL)
      .input("Norek", NorekKOL)
      .input("KTP", KTP)
      .input("Bank", Bank)
      .input("User", User)
      .execute("[MARKETING].[dbo].[SP_InsertNewKOL]");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length == 1) {
        if (result.recordset[0]["RESPONSE_MESSAGE"] !== "undefined") {
          if (result.recordset[0]["RESPONSE_MESSAGE"] == "SUCCESS") {
            resp.status = "true";
            resp.kolId = result.recordset[0]["KOL_ID"];
          } else {
            resp.message = result.recordset[0]["RESPONSE_MESSAGE"];
          }
        } else {
          resp.message = "Unknown Error 3";
        }
      } else {
        resp.message = "Unknown Error 2";
      }
    } else {
      resp.message = "Unknown Error 1";
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetFormatListKol = async (menu) => {
  let resp = { status: "false" };
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("MENU", menu)
      .execute("[MARKETING].[dbo].[SP_GetFormatListKol]");

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        resp.status = "true";
        resp.message = result.recordset;
      }
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetListKol = async () => {
  let resp = { status: "false" };
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .execute("[MARKETING].[dbo].[SP_GetListKol]");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        resp.status = "true";
        resp.message = result.recordset;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetALLKolName = async () => {
  let resp = { status: "false" };
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .execute("[MARKETING].[dbo].[SP_GetAllKolName]");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        resp.status = "true";
        resp.message = result.recordset;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetKolDetailByID = async (req) => {
  let resp = { status: "false" };
  try {
    let Id = req.Id;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("ID", Id)
      .execute("[MARKETING].[dbo].[SP_GetDetailKolByID]");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        resp.status = "true";
        resp.message = result.recordset[0];
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetKontrakDetailByID = async (req) => {
  let resp = { status: "false" };
  try {
    let id = req.Id;
    const pool = await poolPromise;
    const query = QUERIES.GET_CONTRACT_DETAIL_QUERY;
    const result = await pool.request().input("contractId", id).query(query);
    console.log(result.recordset);

    const numberOfSlotQuery = `SELECT COUNT([MARKETING].dbo.Post.[Post Id]) as JumlahPost
    FROM [MARKETING].dbo.Post WHERE [Kontrak Id] = ${id};`;
    const numberOfPostResult = await pool.request().query(numberOfSlotQuery);
    const { recordset: slotNumberRecordset } = numberOfPostResult;
    const [{ JumlahPost }] = slotNumberRecordset;
    const postNumber = JumlahPost + 1;

    const { recordset } = result;
    resp.status = "true";
    resp.message = { ...recordset[0], postNumber };

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetSubMediaById = async (req) => {
  let resp = { status: "false" };
  try {
    let Id = req.Id;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("ID", Id)
      .execute("[MARKETING].[dbo].[SP_GetSubMediaByID]");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        resp.status = "true";
        let listArr = [];
        result.recordset.forEach((element) => {
          listArr.push(element.SUB_MEDIA);
        });
        resp.message = listArr;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const checkFileStatus = async (req) => {
  let resp = { status: "false" };
  console.log("tes:", req);
  try {
    const pool = await poolPromise;
    const result2 = await pool
      .request()
      .input("FileId", req.FileId)
      .execute("[MARKETING].[dbo].[SP_CheckStatusFile]");
    console.log("SP_CheckStatusFile:", result2.recordset);
    if (result2.recordset.length == 1) {
      if (result2.recordset[0]["RESPONSE_MESSAGE"] !== "undefined") {
        if (result2.recordset[0]["RESPONSE_MESSAGE"] == "SUCCESS") {
          resp.status = "true";
          resp.filename = result2.recordset[0]["FILE_NAME"];
        }
      }
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const insertNewKontrak = async (req) => {
  let resp = { status: "false" };
  try {
    let Id = req.Id;
    let SubMedia = req.SubMedia;
    let BookingSlot = req.BookingSlot;
    let BiayaKerjaSama = req.BiayaKerjaSama;
    let Manager = req.Manager;
    let TanggalAwalKerjaSama = req.TanggalAwalKerjaSama;
    let TanggalAkhirKerjaSama = req.TanggalAkhirKerjaSama;
    let User = req.User;
    let DP = req.DP;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id", Id)
      .input("subMedia", SubMedia)
      .input("bookingSlot", BookingSlot)
      .input("biayaKerjaSama", BiayaKerjaSama)
      .input("DP", DP)
      .input("manager", Manager)
      .input("tanggalAwalKerjaSama", TanggalAwalKerjaSama)
      .input("tanggalAkhirKerjaSama", TanggalAkhirKerjaSama)
      .input("User", User)
      .execute("[MARKETING].[dbo].[SP_InsertNewKontrak]");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length == 1) {
        if (result.recordset[0]["RESPONSE_MESSAGE"] !== "undefined") {
          if (result.recordset[0]["RESPONSE_MESSAGE"] == "SUCCESS") {
            resp.status = "true";
            resp.kontrakId = result.recordset[0]["KONTRAK_ID"];
            resp.kontrakKe = result.recordset[0]["KONTRAK_KE"];
            resp.FILE_ID = result.recordset[0]["FILE_ID"];
            req.FileId = result.recordset[0]["FILE_ID"];
            let status = await sendToTheQueue("generate_file_contract", req);
            console.log(
              "sendToTheQueue, queue:generate_file_contract, msg : ",
              req.toString(),
              ",status:",
              status
            );

            let fileStatus = false;
            let count = 0;
            let maxIterator = 5;
            while (!fileStatus && count < maxIterator) {
              const result2 = await pool
                .request()
                .input("FileId", req.FileId)
                .execute("[MARKETING].[dbo].[SP_CheckStatusFile]");
              console.log("SP_CheckStatusFile:", result2.recordset);
              if (result2.recordset.length == 1) {
                if (result2.recordset[0]["RESPONSE_MESSAGE"] !== "undefined") {
                  if (result2.recordset[0]["RESPONSE_MESSAGE"] == "SUCCESS") {
                    fileStatus = true;
                    resp.filename = result2.recordset[0]["FILE_NAME"];
                  }
                }
              }
              await new Promise((resolve) => setTimeout(resolve, 2000));
              count = count + 1;
            }
          } else {
            resp.message = result.recordset[0]["RESPONSE_MESSAGE"];
          }
        } else {
          resp.message = "Unknown Error 3";
        }
      } else {
        resp.message = "Unknown Error 2";
      }
    } else {
      resp.message = "Unknown Error 1";
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetListKontrak = async () => {
  let resp = { status: "false" };
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .execute("[MARKETING].[dbo].[SP_GetListKontrak]");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        resp.status = "true";
        resp.message = result.recordset;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const ExecSPWithoutInput = async (req) => {
  let resp = { status: "false" };
  try {
    let SPName = req.SPName;
    const pool = await poolPromise;

    const result = await pool.request().execute(SPName);
    resp.status = "true";
    resp.message = result.recordset;

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const ExecSPWithInput = async (req) => {
  let resp = { status: "false" };
  try {
    let SPName = req.SPName;
    let input = req.Input;
    const pool = await poolPromise;

    let request = pool.request();

    for (const key in input) {
      request = request.input(key, input[key]);
    }

    const result = await request.execute(SPName);
    console.log(result.recordset);
    if (result.recordset.length >= 1) {
      resp.status = "true";
      resp.message = result.recordset;
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetListKontrakIteration = async () => {
  let resp = { status: "false" };
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .execute("[MARKETING].[dbo].[SP_GetListKontrakIteration]");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        resp.status = "true";
        console.log("halo", result.recordset);
        resp.message = result.recordset;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const insertNewBrief = async (req) => {
  let resp = { status: "false" };
  try {
    let Tema = req.Tema;
    let Konsep = req.Konsep;
    let Script = req.Script;
    let RefLink = req.RefLink;
    let ManagerId = req.ManagerId;
    let User = req.User;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("tema", Tema)
      .input("konsep", Konsep)
      .input("script", Script)
      .input("linkReff", RefLink)
      .input("managerId", ManagerId)
      .input("User", User)
      .execute("[MARKETING].[dbo].[SP_InsertNewBrief]");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length == 1) {
        if (result.recordset[0]["RESPONSE_MESSAGE"] !== "undefined") {
          if (result.recordset[0]["RESPONSE_MESSAGE"] == "SUCCESS") {
            resp.status = "true";
            resp.briefCode = result.recordset[0]["BRIEF_CODE"];
          } else {
            resp.message = result.recordset[0]["RESPONSE_MESSAGE"];
          }
        } else {
          resp.message = "Unknown Error 3";
        }
      } else {
        resp.message = "Unknown Error 2";
      }
    } else {
      resp.message = "Unknown Error 1";
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetListBrief = async () => {
  let resp = { status: "false" };
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .execute("[MARKETING].[dbo].[SP_GetListBrief]");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        resp.status = "true";
        resp.message = result.recordset;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const insertNewManager = async (req) => {
  let resp = { status: "false" };
  try {
    let ManagerName = req.ManagerName;
    let NoWhatsApp = req.NoWhatsApp;
    let Email = req.Email;
    let Alias = req.Alias.toUpperCase();
    let Roles = req.Roles;
    let NoKTP = req.NoKTP;
    let User = req.User;
    let CompanyId = req.User.split("_")[0].replace('"', "");
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("ManagerName", ManagerName)
      .input("NoWhatsApp", NoWhatsApp)
      .input("Email", Email)
      .input("Alias", Alias)
      .input("Roles", Roles)
      .input("NoKTP", NoKTP)
      .input("User", User)
      .execute("[MARKETING].[dbo].[SP_InsertNewManager]");
    console.log("[SP_InsertNewManager] result:", result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length == 1) {
        if (result.recordset[0]["RESPONSE_MESSAGE"] !== "undefined") {
          if (result.recordset[0]["RESPONSE_MESSAGE"] == "SUCCESS") {
            let managerId = result.recordset[0]["MANAGER_ID"];

            const result2 = await pool
              .request()
              .input("COMPANY_ID", CompanyId)
              .input("Alias", Alias)
              .input("Email", Email)
              .input("LevelId", "MK")
              .input("User", User)
              .execute("[MARKETING].[dbo].[SP_CreateNewUser]");
            console.log("[SP_CreateNewUser] result:", result2.recordset);
            if (typeof result2.recordset !== "undefined") {
              //notify to WA & Email
              if (result2.recordset[0]["RESPONSE_MESSAGE"] !== "undefined") {
                if (result2.recordset[0]["RESPONSE_MESSAGE"] == "SUCCESS") {
                  let subject = "New Registration ERP BY JIERA ACCOUNT";
                  let content =
                    "Hi, " +
                    ManagerName +
                    " \n" +
                    "you are registered on ERP BY JIERA Website (erpbyjiera.com) \n" +
                    "your User: " +
                    CompanyId +
                    "_" +
                    Alias +
                    "\n" +
                    "your Password: " +
                    "12345678" +
                    " \n" +
                    "Please use your account wisely";
                  let respEmail = await sendEmail(Email, subject, content);
                  console.log("respEmail:", respEmail);
                }
              }
            }
            resp.managerId = managerId;
            resp.status = "true";
          } else {
            resp.message = result.recordset[0]["RESPONSE_MESSAGE"];
          }
        } else {
          resp.message = "Unknown Error 3";
        }
      } else {
        resp.message = "Unknown Error 2";
      }
    } else {
      resp.message = "Unknown Error 1";
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const GetListManager = async () => {
  let resp = { status: "false" };
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .execute("[MARKETING].[dbo].[SP_GetListManager]");
    console.log(result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length >= 1) {
        resp.status = "true";
        resp.message = result.recordset;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const insertNewPost = async (req) => {
  let resp = { status: "false" };
  console.log("ini req", req);
  try {
    const { KontrakId, ManagerId, BriefId, TglPostKontrak, User } = req;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("KontrakId", KontrakId)
      .input("ManagerId", ManagerId)
      .input("BriefId", BriefId)
      .input("TglPostKontrak", TglPostKontrak)
      .input("User", User)
      .execute("[MARKETING].[dbo].[SP_InsertNewPost]");
    console.log("[SP_InsertNewPost] result:", result.recordset);

    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length == 1) {
        if (result.recordset[0]["RESPONSE_MESSAGE"] !== "undefined") {
          if (result.recordset[0]["RESPONSE_MESSAGE"] == "SUCCESS") {
            let postId = result.recordset[0]["POST_ID"];
            resp.postId = postId;
            resp.status = "true";
          } else {
            resp.message = result.recordset[0]["RESPONSE_MESSAGE"];
          }
        } else {
          resp.message = "Unknown Error 3";
        }
      } else {
        resp.message = "Unknown Error 2";
      }
    } else {
      resp.message = "Unknown Error 1";
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const UpdatePostStatsById = async (req) => {
  let resp = { status: "false" };
  try {
    let Id = req.Id;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("Id", Id)
      .execute("[MARKETING].[dbo].[SP_GetPostDetailById]");
    if (typeof result.recordset !== "undefined") {
      if (result.recordset.length == 1) {
        let linkPost = result.recordset[0]["Link Post"];
        let data = JSON.stringify({
          video_url: linkPost,
        });
        try {
          const res = await axios.post(
            PYTHON_URL + "/getTiktokVideoWithUserStats/",
            data,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (res.data.data !== "undefined") {
            let data = res.data.data;
            console.log("data:", data);
            let followerCount = data.user.followerCount;
            let viewCount = data.video.viewCount;
            let likeCount = data.video.likeCount;
            let shareCount = data.video.shareCount;
            let commentCount = data.video.shareCount;

            const result2 = await pool
              .request()
              .input("Id", Id)
              .input("followerCount", followerCount)
              .input("viewCount", viewCount)
              .input("likeCount", likeCount)
              .input("shareCount", shareCount)
              .input("commentCount", commentCount)
              .execute("[MARKETING].[dbo].[SP_UpdatePostStatsById]");
            if (typeof result2.recordset !== "undefined") {
              console.log("SP_UpdatePostStatsById", result2.recordset);
              if (result2.recordset[0]["RESPONSE_MESSAGE"] == "SUCCESS") {
                resp.status = "true";
                resp.message = "success";
              } else {
                resp.message = "fail to update post stats";
              }
            }
          } else {
            resp.message = "fail get video stats";
          }
        } catch (err) {
          console.error(err);
          resp.message = "fail get video stats";
        }
      } else {
        resp.message = "Can not found post id";
      }
    } else {
      resp.message = "Can not found post id";
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getPostDetail = async (req) => {
  let resp = { status: "false" };
  try {
    const { id } = req;
    const pool = await poolPromise;
    const query = QUERIES.GET_POST_DETAIL_QUERY;
    const result = await pool.request().input("postId", id).query(query);
    console.log(result.recordset);

    const { recordset } = result;
    resp.status = "true";
    resp.message = { ...recordset[0] };

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const _getDayDifference = (early, later) => {
  const diffTime = Math.abs(later - early);
  console.log(early, later);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
};

const updatePostById = async (id, payload) => {
  let resp = { status: "false" };
  const { linkPost, deadlineDate, uploadDate } = payload;
  const today = new Date()
  const todayGMT = today.setHours(today.getHours() + 7);
  try {
    const differenceUploadDateToToday = _getDayDifference(
      new Date(uploadDate),
      new Date(todayGMT)
    );
    const pool = await poolPromise;
    const query = QUERIES.UPDATE_POST_QUERY;
    const result = await pool
      .request()
      .input("postId", id)
      .input("linkPost", linkPost)
      .input("deadlineDate", deadlineDate)
      .input("uploadDate", uploadDate)
      .query(query);
    console.log(result);

    const { rowsAffected } = result;
    if (rowsAffected[0] === 1) {
      resp.status = "true";
    }

    if (differenceUploadDateToToday > 0) {
      console.log("Update post statistic for day 1");
      const fetchedStatistic = await PythonConnector.fetchPostStatistic(
        linkPost
      );
      const { message } = fetchedStatistic;
      const {
        user: { followerCount },
        video: { commentCount, likeCount, shareCount, viewCount },
      } = message;
      const postStatistic = {
        followers: followerCount,
        comments: commentCount,
        likes: likeCount,
        shares: shareCount,
        views: viewCount,
        postId: id,
        dateDifference: 1,
      };

      await _insertPostStatistic(postStatistic);
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const _insertNewLog = async (payload) => {
  try {
    const { query, user, responseMessage } = payload;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("query", query)
      .input("user", user)
      .input("responseMessage", responseMessage)
      .query(QUERIES.INSERT_NEW_LOG);
  } catch (error) {
    console.log(error);
  }
};

const _insertPostStatistic = async (payload) => {
  let resp = { status: "false" };

  try {
    const pool = await poolPromise;
    const {
      postId,
      followers,
      likes,
      views,
      comments,
      shares,
      dateDifference,
    } = payload;
    const result = await pool
      .request()
      .input("postId", postId)
      .input("followers", followers)
      .input("likes", likes)
      .input("views", views)
      .input("comments", comments)
      .input("shares", shares)
      .input("dayNumber", dateDifference)
      .execute("[MARKETING].[dbo].[SP_UpdatePostStatisticById]");

    const { recordset, recordsets } = result;
    const [{ RESPONSE_MESSAGE }] = recordset;

    const logPayload = {
      query: "INSERT INTO DBO.POST_VIEW FOR POST ID: " + postId,
      responseMessage: RESPONSE_MESSAGE,
      user: "",
    };
    await _insertNewLog(logPayload);

    if (RESPONSE_MESSAGE === "SUCCESS") {
      resp.status = "true";
    }

    return resp;
  } catch (error) {
    console.log(error);
  }
};

const updatePostStatisticScheduler = async () => {
  let resp = { status: "false" };
  const dayToFetch = [1, 3, 7, 14, 28];

  try {
    const pool = await poolPromise;
    const query = QUERIES.GET_UPLOADED_POST;
    const result = await pool.request().query(query);

    const { recordset = [] } = result;
    const postsToBeUpdated = recordset.filter((data) =>
      dayToFetch.includes(data.dateDifference)
    );
    console.log("Posts to Be Updated:", postsToBeUpdated);

    const postsStatistics = await Promise.all(
      postsToBeUpdated.map(async (post) => {
        const { postId, linkPost, dateDifference } = post;
        const mappedInfo = { postId, linkPost, dateDifference };
        const emptyPost = {
          followers: 0,
          comments: 0,
          likes: 0,
          shares: 0,
          views: 0,
        };

        const fetchedStatistic = await PythonConnector.fetchPostStatistic(
          linkPost
        );
        console.log("Fetched Statistic", fetchedStatistic);
        const { status, message } = fetchedStatistic;

        if (status === "false") {
          return { ...mappedInfo, ...emptyPost };
        }

        const {
          user: { followerCount },
          video: { commentCount, likeCount, shareCount, viewCount },
        } = message;
        const postStatistic = {
          followers: followerCount,
          comments: commentCount,
          likes: likeCount,
          shares: shareCount,
          views: viewCount,
        };

        return { ...mappedInfo, ...postStatistic };
      })
    );

    postsStatistics.forEach(async (post) => await _insertPostStatistic(post));

    resp.status = "true";
    resp.message = { ...recordset[0] };

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getPostStatisticByPostId = async (postId) => {
  let resp = { status: "false" };

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("postId", postId)
      .query(QUERIES.GET_POST_STATISTIC_BY_POST_ID);
    console.log("halo", result.recordset);

    const { recordset } = result;
    resp.status = "true";
    resp.message = recordset;

    return resp;
  } catch (error) {
    console.log(error);
  }
};

const getContractRenewalList = async (postId) => {
  let resp = { status: "false" };

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("postId", postId)
      .query(QUERIES.GET_CONTRACT_RENEWAL_LIST);
    console.log(result.recordset);

    const { recordset } = result;
    resp.status = "true";
    resp.message = recordset;

    return resp;
  } catch (error) {
    console.log(error);
  }
};

const getBriefDetail = async (briefId) => {
  let resp = { status: "false" };

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("briefId", briefId)
      .query(QUERIES.GET_BRIEF_DETAIL);
    console.log(result.recordset);

    const { recordset } = result;
    resp.status = "true";
    resp.message = recordset[0];

    return resp;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  insertNewKOL,
  GetFormatListKol,
  GetListKol,
  GetALLKolName,
  GetKolDetailByID,
  GetSubMediaById,
  insertNewKontrak,
  GetListKontrak,
  GetKontrakDetailByID,
  insertNewBrief,
  GetListBrief,
  insertNewManager,
  procToSendEmail,
  sendMessageToQueue,
  GetListManager,
  GetListKontrakIteration,
  insertNewPost,
  checkFileStatus,
  ExecSPWithoutInput,
  ExecSPWithInput,
  UpdatePostStatsById,
  getPostDetail,
  updatePostById,
  updatePostStatisticScheduler,
  _insertPostStatistic,
  getPostStatisticByPostId,
  getContractRenewalList,
  getBriefDetail
};
