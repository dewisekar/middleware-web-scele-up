const { sql, execQuery, poolPromise } = require("../utility/database");

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
    let PicAwal = req.PicAwal;
    let FileMou = req.FileMou;
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
      .input("picAwal", PicAwal)
      .input("fileMou", FileMou)
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

module.exports = {
  insertNewKOL,
  GetFormatListKol,
  GetListKol,
  GetALLKolName,
  GetKolDetailByID,
  GetSubMediaById,
  insertNewKontrak,
  GetListKontrak,
};
