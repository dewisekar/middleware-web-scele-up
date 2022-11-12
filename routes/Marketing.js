const { sql, execQuery, poolPromise } = require("../utility/database");
const nodemailer = require("nodemailer");

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

const GetListKol = async (req) => {
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
        listArr = [];
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

const insertNewKontrak = async (req) => {
  let resp = { status: "false" };
  try {
    let Id = req.Id;
    let SubMedia = req.SubMedia;
    let BookingSlot = req.BookingSlot;
    let BiayaKerjaSama = req.BiayaKerjaSama;
    let Manager = req.Manager;
    // let FileMou = req.FileMou;
    let TanggalAwalKerjaSama = req.TanggalAwalKerjaSama;
    let TanggalAkhirKerjaSama = req.TanggalAkhirKerjaSama;
    let User = req.User;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("id", Id)
      .input("subMedia", SubMedia)
      .input("bookingSlot", BookingSlot)
      .input("biayaKerjaSama", BiayaKerjaSama)
      .input("manager", Manager)
      // .input("fileMou", FileMou)
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
    let User = req.User;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("tema", Tema)
      .input("konsep", Konsep)
      .input("script", Script)
      .input("linkReff", RefLink)
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
  try {
    let KontrakId = req.KontrakId;
    let ManagerId = req.ManagerId;
    let BriefId = req.BriefId;
    let LinkPost = req.LinkPost;
    let User = req.User;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("KontrakId", KontrakId)
      .input("ManagerId", ManagerId)
      .input("BriefId", BriefId)
      .input("LinkPost", LinkPost)
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

module.exports = {
  insertNewKOL,
  GetFormatListKol,
  GetListKol,
  GetALLKolName,
  GetKolDetailByID,
  GetSubMediaById,
  insertNewKontrak,
  GetListKontrak,
  insertNewBrief,
  GetListBrief,
  insertNewManager,
  procToSendEmail,
  GetListManager,
  GetListKontrakIteration,
  insertNewPost,
};
