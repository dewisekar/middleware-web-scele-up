/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const axios = require('axios');
const nodemailer = require('nodemailer');
const fs = require('fs');

const { poolPromise } = require('../utility/database');
const { sendToTheQueue } = require('../utility/rabbitmq');
const { getVideoAndUserStatistic } = require('./TiktokService');
const { PYTHON_URL } = require('../config');
const { QUERIES } = require('../queries/index');
const PythonConnector = require('../connectors/PythonConnector');
const WhatsappConnector = require('../connectors/WhatsappConnector');
const GenerateFile = require('./GenerateFile');
const {
  getPostReminderTemplate,
  getContractReminderTemplate,
  getBroadcastBriefTemplate,
  getInvoiceReminderTemplate
} = require('../message-template');
const { convertDate, DateMode, convertToIdr } = require('../utils');

const sendEmail = async (receiverEmail, subject, content) => {
  let response = 'failed';
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jiera.fullstack@gmail.com',
      pass: 'aqqnedeocsegjhlp'
    }
  });

  await transporter.verify().then(console.log).catch(console.error);
  await transporter
    .sendMail({
      from: '"Jiera Fullstack" <jiera.fullstack@gmail.com>',
      to: receiverEmail,
      subject,
      text: content
    })
    .then((info) => {
      console.log('transporter send email', { info });
      response = 'success';
    })
    .catch(console.error);
  return response;
};

const sendMessageToQueue = async (req) => {
  const resp = { status: 'false' };
  const queueName = req.Queue;
  const message = req.Message;
  try {
    const status = await sendToTheQueue(queueName, message);
    if (status) resp.status = 'true';
  } catch (err) {
    console.error(err);
  }
  return resp;
};

const procToSendEmail = async (req) => {
  const resp = { status: 'false' };
  try {
    const { receiverEmail } = req;
    const { subject } = req;
    const { content } = req;
    const response = await sendEmail(receiverEmail, subject, content);
    console.log('sendEmail response:', response);
    if (response === 'success') {
      resp.status = 'true';
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const replaceToIndonesianPhoneNumberFormat = (phoneNumber) => {
  const phoneNumberFirstDigit = phoneNumber[0];
  const phoneNumberFirstThreeDigit = phoneNumber.substring(0, 3);
  const indonesianCodePhoneNumber = '62';

  if (phoneNumberFirstDigit === '0') {
    return phoneNumber.replace(
      phoneNumberFirstDigit,
      indonesianCodePhoneNumber
    );
  }
  if (phoneNumberFirstThreeDigit === '+62') {
    return phoneNumber.replace(
      phoneNumberFirstThreeDigit,
      indonesianCodePhoneNumber
    );
  }
  return phoneNumber;
};

const insertNewKOL = async (req) => {
  const resp = { status: 'false' };
  try {
    const { JenisEndorse } = req;
    const { JenisPlatform } = req;
    const { KategoriKOL } = req;
    const { NamaKOL } = req;
    const { UsernameKOL } = req;
    const NoWhatsapp = replaceToIndonesianPhoneNumberFormat(req.NoWhatsapp);
    const { AlamatKOL } = req;
    const { NorekKOL } = req;
    const { KTP } = req;
    const { Bank } = req;
    const { User } = req;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('JenisEndorse', JenisEndorse)
      .input('JenisPlatform', JenisPlatform)
      .input('KategoriKOL', KategoriKOL)
      .input('NamaKOL', NamaKOL)
      .input('UsernameKOL', UsernameKOL)
      .input('NoWhatsapp', NoWhatsapp)
      .input('AlamatKOL', AlamatKOL)
      .input('Norek', NorekKOL)
      .input('KTP', KTP)
      .input('Bank', Bank)
      .input('User', User)
      .execute('[MARKETING].[dbo].[SP_InsertNewKOL]');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length === 1) {
        if (result.recordset[0].RESPONSE_MESSAGE !== 'undefined') {
          if (result.recordset[0].RESPONSE_MESSAGE === 'SUCCESS') {
            resp.status = 'true';
            resp.kolId = result.recordset[0].KOL_ID;
          } else {
            resp.message = result.recordset[0].RESPONSE_MESSAGE;
          }
        } else {
          resp.message = 'Unknown Error 3';
        }
      } else {
        resp.message = 'Unknown Error 2';
      }
    } else {
      resp.message = 'Unknown Error 1';
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getFormatListKol = async (menu) => {
  const resp = { status: 'false' };
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('MENU', menu)
      .execute('[MARKETING].[dbo].[SP_GetFormatListKol]');

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        resp.message = result.recordset;
      }
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getListKol = async () => {
  const resp = { status: 'false' };
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .execute('[MARKETING].[dbo].[SP_GetListKol]');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        resp.message = result.recordset;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getALLKolName = async () => {
  const resp = { status: 'false' };
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .execute('[MARKETING].[dbo].[SP_GetAllKolName]');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        resp.message = result.recordset;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getKolDetailByID = async (req) => {
  const resp = { status: 'false' };
  try {
    const { Id } = req;
    console.log('ini id', Id);
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('ID', Id)
      .execute('[MARKETING].[dbo].[SP_GetDetailKolByID]');
    console.log(result.recordset);
    console.log('ini ersult', result);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        const { recordset } = result;
        const [firstRecord] = recordset;
        resp.message = firstRecord;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getKontrakDetailByID = async (req) => {
  const resp = { status: 'false' };
  try {
    const id = req.Id;
    const pool = await poolPromise;
    const query = QUERIES.GET_CONTRACT_DETAIL_QUERY;
    const result = await pool.request().input('contractId', id).query(query);
    console.log(result.recordset);

    const numberOfSlotQuery = `SELECT COUNT([MARKETING].dbo.Post.[Post Id]) as JumlahPost
    FROM [MARKETING].dbo.Post WHERE [Kontrak Id] = ${id};`;
    const numberOfPostResult = await pool.request().query(numberOfSlotQuery);
    const { recordset: slotNumberRecordset } = numberOfPostResult;
    const [{ JumlahPost }] = slotNumberRecordset;
    const postNumber = JumlahPost + 1;

    const { recordset } = result;
    resp.status = 'true';
    resp.message = { ...recordset[0], postNumber };

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getSubMediaById = async (req) => {
  const resp = { status: 'false' };
  try {
    const { Id } = req;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('ID', Id)
      .execute('[MARKETING].[dbo].[SP_GetSubMediaByID]');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        const listArr = [];
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

const _regenerateContract = async (contractId, isNewContract = true) => {
  try {
    const pool = await poolPromise;
    const query = QUERIES.GET_CONTRACT_DETAIL_QUERY;
    const result = await pool
      .request()
      .input('contractId', contractId)
      .query(query);

    const {
      managerName,
      managerKtp,
      managerRole,
      kolName,
      username,
      platform,
      kolKtp,
      kolAddress,
      kolBank,
      kolRekening,
      DP
    } = result.recordset[0];

    const BIAYA = result.recordset[0]['Total Kerjasama'];
    const contractStartDate = result.recordset[0]['Masa Kontrak Mulai'];
    const contractEndDate = result.recordset[0]['Masa Kontrak Akhir'];
    const contractSignedDate = result.recordset[0]['Tgl Kontrak'];
    const SLOT = result.recordset[0]['Booking Slot'];
    const convertedSignedDate = new Date(contractSignedDate);

    const payload = {
      ID: contractId.length < 3 ? (`00${contractId}`).slice(-3) : contractId,
      BULAN: (`0${convertedSignedDate.getMonth() + 1}`).slice(-2),
      TAHUN: convertedSignedDate.getFullYear(),
      DATE_NOW: convertDate(contractSignedDate, DateMode.DDDDMMYYY_INDONESIAN),
      MANAGER_NAME: managerName,
      MANAGER_ROLE: managerRole,
      MANAGER_KTP: managerKtp,
      KOL_NAME: kolName,
      KOL_KTP: kolKtp,
      KOL_ALAMAT: kolAddress,
      PLATFORM: platform,
      USERNAME: username,
      TANGGAL_AWAL: convertDate(contractStartDate, DateMode.DDMMYYYY_INDONESIAN),
      TANGGAL_AKHIR: convertDate(contractEndDate, DateMode.DDMMYYYY_INDONESIAN),
      BIAYA: convertToIdr(BIAYA),
      DP_Percentage: `${DP}%`,
      Sisa_DP: convertToIdr(BIAYA - ((BIAYA * DP) / 100)),
      NOREK: kolRekening,
      BANK: kolBank,
      SLOT,
      DP: convertToIdr((BIAYA * DP) / 100)
    };

    const fileName = await GenerateFile.generateFile(payload);

    const updateQuery = isNewContract ? QUERIES.INSERT_FILE_MOU : QUERIES.UPDATE_FILE_MOU;
    await pool
      .request()
      .input('contractId', contractId)
      .input('fileName', fileName)
      .query(updateQuery);

    return fileName;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const checkFileStatus = async (req) => {
  const resp = { status: 'false' };
  console.log('tes:', req);
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('FileId', req.FileId)
      .execute('[MARKETING].[dbo].[SP_CheckStatusFile]');
    console.log('SP_CheckStatusFile:', result.recordset);

    const newGeneratedFile = await _regenerateContract(req.FileId, false);

    resp.filename = newGeneratedFile;
    resp.status = 'true';
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const insertNewKontrak = async (req) => {
  const resp = { status: 'false' };
  try {
    const { Id } = req;
    const { SubMedia } = req;
    const { BookingSlot } = req;
    const { BiayaKerjaSama } = req;
    const { Manager } = req;
    const { TanggalAwalKerjaSama } = req;
    const { TanggalAkhirKerjaSama } = req;
    const { User } = req;
    const { DP } = req;
    const pool = await poolPromise;

    const fetchedKol = await pool
      .request()
      .input('ID', Id)
      .execute('[MARKETING].[dbo].[SP_GetDetailKolByID]');
    const { recordset: kolResult } = fetchedKol;
    const [kolFirstRecord] = kolResult;
    const message = getInvoiceReminderTemplate(kolFirstRecord.NAME);
    const messagePayload = {
      number: `${kolFirstRecord.NO_HP}@c.us`,
      message
    };
    // const

    const result = await pool
      .request()
      .input('id', Id)
      .input('subMedia', SubMedia)
      .input('bookingSlot', BookingSlot)
      .input('biayaKerjaSama', BiayaKerjaSama)
      .input('DP', DP)
      .input('manager', Manager)
      .input('tanggalAwalKerjaSama', TanggalAwalKerjaSama)
      .input('tanggalAkhirKerjaSama', TanggalAkhirKerjaSama)
      .input('User', User)
      .execute('[MARKETING].[dbo].[SP_InsertNewKontrak]');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length === 1) {
        if (result.recordset[0].RESPONSE_MESSAGE !== 'undefined') {
          if (result.recordset[0].RESPONSE_MESSAGE === 'SUCCESS') {
            const contractId = result.recordset[0].KONTRAK_ID;
            resp.status = 'true';
            resp.kontrakId = contractId;
            resp.kontrakKe = result.recordset[0].KONTRAK_KE;
            resp.FILE_ID = result.recordset[0].FILE_ID;
            req.FileId = result.recordset[0].FILE_ID;

            const newGeneratedFile = await _regenerateContract(contractId, true);
            await WhatsappConnector.sendMessage(messagePayload);

            resp.filename = newGeneratedFile;
          } else {
            resp.message = result.recordset[0].RESPONSE_MESSAGE;
          }
        } else {
          resp.message = 'Unknown Error 3';
        }
      } else {
        resp.message = 'Unknown Error 2';
      }
    } else {
      resp.message = 'Unknown Error 1';
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getListKontrak = async () => {
  const resp = { status: 'false' };
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .execute('[MARKETING].[dbo].[SP_GetListKontrak]');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        resp.message = result.recordset;
      }
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const execSPWithoutInput = async (req) => {
  const resp = { status: 'false' };
  try {
    const { SPName } = req;
    const pool = await poolPromise;

    const result = await pool.request().execute(SPName);
    resp.status = 'true';
    resp.message = result.recordset;

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const execSPWithInput = async (req) => {
  const resp = { status: 'false' };
  try {
    const { SPName } = req;
    const input = req.Input;
    const pool = await poolPromise;

    let request = pool.request();

    // eslint-disable-next-line no-restricted-syntax
    for (const key in input) {
      request = request.input(key, input[key]);
    }

    const result = await request.execute(SPName);
    console.log(result.recordset);
    if (result.recordset.length >= 1) {
      resp.status = 'true';
      resp.message = result.recordset;
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getListKontrakIteration = async () => {
  const resp = { status: 'false' };
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .execute('[MARKETING].[dbo].[SP_GetListKontrakIteration]');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
        console.log('halo', result.recordset);
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
  const resp = { status: 'false' };
  try {
    const { Tema } = req;
    const { Konsep } = req;
    const { Script } = req;
    const { RefLink } = req;
    const { ManagerId } = req;
    const { User, link } = req;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('tema', Tema)
      .input('konsep', Konsep)
      .input('script', Script)
      .input('linkReff', RefLink)
      .input('managerId', ManagerId)
      .input('User', User)
      .input('link', link)
      .execute('[MARKETING].[dbo].[SP_InsertNewBrief]');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length === 1) {
        if (result.recordset[0].RESPONSE_MESSAGE !== 'undefined') {
          if (result.recordset[0].RESPONSE_MESSAGE === 'SUCCESS') {
            resp.status = 'true';
            resp.briefCode = result.recordset[0].BRIEF_CODE;
          } else {
            resp.message = result.recordset[0].RESPONSE_MESSAGE;
          }
        } else {
          resp.message = 'Unknown Error 3';
        }
      } else {
        resp.message = 'Unknown Error 2';
      }
    } else {
      resp.message = 'Unknown Error 1';
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getListBrief = async () => {
  const resp = { status: 'false' };
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .execute('[MARKETING].[dbo].[SP_GetListBrief]');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
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
  const resp = { status: 'false' };
  try {
    const { ManagerName } = req;
    const { NoWhatsApp } = req;
    const { Email } = req;
    const Alias = req.Alias.toUpperCase();
    const { Roles } = req;
    const { NoKTP } = req;
    const { User } = req;
    const CompanyId = req.User.split('_')[0].replace('"', '');
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('ManagerName', ManagerName)
      .input('NoWhatsApp', NoWhatsApp)
      .input('Email', Email)
      .input('Alias', Alias)
      .input('Roles', Roles)
      .input('NoKTP', NoKTP)
      .input('User', User)
      .execute('[MARKETING].[dbo].[SP_InsertNewManager]');
    console.log('[SP_InsertNewManager] result:', result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length === 1) {
        if (result.recordset[0].RESPONSE_MESSAGE !== 'undefined') {
          if (result.recordset[0].RESPONSE_MESSAGE === 'SUCCESS') {
            const managerId = result.recordset[0].MANAGER_ID;

            const result2 = await pool
              .request()
              .input('COMPANY_ID', CompanyId)
              .input('Alias', Alias)
              .input('Email', Email)
              .input('LevelId', 'MK')
              .input('User', User)
              .execute('[MARKETING].[dbo].[SP_CreateNewUser]');
            console.log('[SP_CreateNewUser] result:', result2.recordset);
            if (typeof result2.recordset !== 'undefined') {
              // notify to WA & Email
              if (result2.recordset[0].RESPONSE_MESSAGE !== 'undefined') {
                if (result2.recordset[0].RESPONSE_MESSAGE === 'SUCCESS') {
                  const subject = 'New Registration ERP BY JIERA ACCOUNT';
                  const content = `Hi, ${
                    ManagerName
                  } \n`
                    + 'you are registered on ERP BY JIERA Website (erpbyjiera.com) \n'
                    + `your User: ${
                      CompanyId
                    }_${
                      Alias
                    }\n`
                    + 'your Password: '
                    + '12345678'
                    + ' \n'
                    + 'Please use your account wisely';
                  const respEmail = await sendEmail(Email, subject, content);
                  console.log('respEmail:', respEmail);
                }
              }
            }
            resp.managerId = managerId;
            resp.status = 'true';
          } else {
            resp.message = result.recordset[0].RESPONSE_MESSAGE;
          }
        } else {
          resp.message = 'Unknown Error 3';
        }
      } else {
        resp.message = 'Unknown Error 2';
      }
    } else {
      resp.message = 'Unknown Error 1';
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getListManager = async () => {
  const resp = { status: 'false' };
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .execute('[MARKETING].[dbo].[SP_GetListManager]');
    console.log(result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length >= 1) {
        resp.status = 'true';
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
  const resp = { status: 'false' };
  try {
    const {
      KontrakId, ManagerId, BriefId, TglPostKontrak, User
    } = req;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('KontrakId', KontrakId)
      .input('ManagerId', ManagerId)
      .input('BriefId', BriefId)
      .input('TglPostKontrak', TglPostKontrak)
      .input('User', User)
      .execute('[MARKETING].[dbo].[SP_InsertNewPost]');
    console.log('[SP_InsertNewPost] result:', result.recordset);

    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length === 1) {
        if (result.recordset[0].RESPONSE_MESSAGE !== 'undefined') {
          if (result.recordset[0].RESPONSE_MESSAGE === 'SUCCESS') {
            const postId = result.recordset[0].POST_ID;
            resp.postId = postId;
            resp.status = 'true';
          } else {
            resp.message = result.recordset[0].RESPONSE_MESSAGE;
          }
        } else {
          resp.message = 'Unknown Error 3';
        }
      } else {
        resp.message = 'Unknown Error 2';
      }
    } else {
      resp.message = 'Unknown Error 1';
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const updatePostStatsById = async (req) => {
  const resp = { status: 'false' };
  try {
    const { Id } = req;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('Id', Id)
      .execute('[MARKETING].[dbo].[SP_GetPostDetailById]');
    if (typeof result.recordset !== 'undefined') {
      if (result.recordset.length === 1) {
        const linkPost = result.recordset[0]['Link Post'];
        const data = JSON.stringify({
          video_url: linkPost
        });
        try {
          const res = await axios.post(
            `${PYTHON_URL}/getTiktokVideoWithUserStats/`,
            data,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          if (res.data.data !== 'undefined') {
            const { data: postData } = res.data;
            console.log('data:', postData);
            const { followerCount } = postData.user;
            const { viewCount } = postData.video;
            const { likeCount } = postData.video;
            const { shareCount } = postData.video;
            const commentCount = postData.video.shareCount;

            const result2 = await pool
              .request()
              .input('Id', Id)
              .input('followerCount', followerCount)
              .input('viewCount', viewCount)
              .input('likeCount', likeCount)
              .input('shareCount', shareCount)
              .input('commentCount', commentCount)
              .execute('[MARKETING].[dbo].[SP_UpdatePostStatsById]');
            if (typeof result2.recordset !== 'undefined') {
              console.log('SP_UpdatePostStatsById', result2.recordset);
              if (result2.recordset[0].RESPONSE_MESSAGE === 'SUCCESS') {
                resp.status = 'true';
                resp.message = 'success';
              } else {
                resp.message = 'fail to update post stats';
              }
            }
          } else {
            resp.message = 'fail get video stats';
          }
        } catch (err) {
          console.error(err);
          resp.message = 'fail get video stats';
        }
      } else {
        resp.message = 'Can not found post id';
      }
    } else {
      resp.message = 'Can not found post id';
    }
    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getPostDetail = async (req) => {
  const resp = { status: 'false' };
  try {
    const { id } = req;
    const pool = await poolPromise;
    const query = QUERIES.GET_POST_DETAIL_QUERY;
    const result = await pool.request().input('postId', id).query(query);
    console.log(result.recordset);

    const { recordset } = result;
    resp.status = 'true';
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

const _insertNewLog = async (payload) => {
  try {
    const { query, user, responseMessage } = payload;
    const pool = await poolPromise;
    await pool
      .request()
      .input('query', query)
      .input('user', user)
      .input('responseMessage', responseMessage)
      .query(QUERIES.INSERT_NEW_LOG);
  } catch (error) {
    console.log(error);
  }
};

const _insertPostStatistic = async (payload) => {
  const resp = { status: 'false' };

  try {
    const pool = await poolPromise;
    const {
      postId,
      followers,
      likes,
      views,
      comments,
      shares,
      dateDifference
    } = payload;
    const result = await pool
      .request()
      .input('postId', postId)
      .input('followers', followers)
      .input('likes', likes)
      .input('views', views)
      .input('comments', comments)
      .input('shares', shares)
      .input('dayNumber', dateDifference)
      .execute('[MARKETING].[dbo].[SP_UpdatePostStatisticById]');

    const { recordset } = result;
    const [{ RESPONSE_MESSAGE }] = recordset;

    const logPayload = {
      query: `INSERT INTO DBO.POST_VIEW FOR POST ID: ${postId}`,
      responseMessage: RESPONSE_MESSAGE,
      user: ''
    };
    await _insertNewLog(logPayload);

    if (RESPONSE_MESSAGE === 'SUCCESS') {
      resp.status = 'true';
    }

    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const updatePostById = async (id, payload) => {
  const resp = { status: 'false' };
  const {
    linkPost, deadlineDate, uploadDate, platform, isFyp
  } = payload;
  const today = new Date();
  try {
    const differenceUploadDateToToday = _getDayDifference(new Date(uploadDate), today);
    const pool = await poolPromise;
    const query = QUERIES.UPDATE_POST_QUERY;
    const result = await pool
      .request()
      .input('postId', id)
      .input('linkPost', linkPost)
      .input('deadlineDate', deadlineDate)
      .input('uploadDate', uploadDate)
      .input('isFyp', isFyp)
      .query(query);
    console.log(result);

    const { rowsAffected } = result;
    if (rowsAffected[0] === 1) {
      resp.status = 'true';
    }

    if (differenceUploadDateToToday > 0 && platform === 'Tiktok') {
      console.log('Update post statistic for day 1');
      const fetchedStatistic = await PythonConnector.fetchPostStatistic(
        linkPost
      );
      const { message } = fetchedStatistic;
      const {
        user: { followerCount },
        video: {
          commentCount, likeCount, shareCount, viewCount
        }
      } = message;
      const postStatistic = {
        followers: followerCount,
        comments: commentCount,
        likes: likeCount,
        shares: shareCount,
        views: viewCount,
        postId: id,
        dateDifference: 1
      };

      await _insertPostStatistic(postStatistic);
    }

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

// eslint-disable-next-line no-promise-executor-return
const sleep = async (time) => new Promise((resolve) => setTimeout(resolve, time));

const updatePostStatisticScheduler = async () => {
  const resp = { status: 'false' };
  const dayToFetch = [1, 3, 7, 14, 28];

  try {
    const pool = await poolPromise;
    const query = QUERIES.GET_UPLOADED_POST;
    const result = await pool.request().query(query);

    const { recordset = [] } = result;
    const postsToBeUpdated = recordset.filter((data) => dayToFetch.includes(data.dateDifference));
    console.log('Posts to Be Updated:', postsToBeUpdated);
    console.log('Amount:', postsToBeUpdated.length);

    const postsStatistics = [];
    for (const post of postsToBeUpdated) {
      const { postId, linkPost, dateDifference } = post;
      const mappedInfo = { postId, linkPost, dateDifference };
      const emptyPost = {
        followers: 0,
        comments: 0,
        likes: 0,
        shares: 0,
        views: 0
      };
      console.log('Fetching post statistic for link: ', linkPost, postId);
      const fetchedStatistic = await PythonConnector.fetchPostStatistic(
        linkPost
      );

      console.log('Fetched Statistic', fetchedStatistic, postId);
      const { status, message } = fetchedStatistic;

      if (status === false || status === '201' || !message) {
        postsStatistics.push({ ...mappedInfo, ...emptyPost });
        // eslint-disable-next-line no-continue
        continue;
      }

      const {
        user: { followerCount },
        video: {
          stats: {
            commentCount, likeCount, shareCount, viewCount
          }
        }
      } = message;
      const postStatistic = {
        followers: followerCount,
        comments: commentCount,
        likes: likeCount,
        shares: shareCount,
        views: viewCount
      };

      postsStatistics.push({ ...mappedInfo, ...postStatistic });
      await sleep(2000);
    }
    console.log('ini', postsStatistics);

    // eslint-disable-next-line no-return-await
    postsStatistics.forEach(async (post) => await _insertPostStatistic(post));

    resp.status = 'true';
    resp.message = { ...recordset[0] };

    // eslint-disable-next-line consistent-return
    return resp;
  } catch (err) {
    console.error(err);
    // eslint-disable-next-line consistent-return
    return resp;
  }
};

const getPostStatisticByPostId = async (postId) => {
  const resp = { status: 'false' };

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('postId', postId)
      .query(QUERIES.GET_POST_STATISTIC_BY_POST_ID);
    console.log('halo', result.recordset);

    const { recordset } = result;
    resp.status = 'true';
    resp.message = recordset;

    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getContractRenewalList = async (postId) => {
  const resp = { status: 'false' };

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('postId', postId)
      .query(QUERIES.GET_CONTRACT_RENEWAL_LIST);
    console.log(result.recordset);

    const { recordset } = result;
    resp.status = 'true';
    resp.message = recordset;

    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getBriefDetail = async (briefId) => {
  const resp = { status: 'false' };

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('briefId', briefId)
      .query(QUERIES.GET_BRIEF_DETAIL);
    console.log(result.recordset);

    resp.status = 'true';
    const { recordset } = result;
    const [firstRecord] = recordset;
    resp.message = firstRecord;

    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getPostViewByManagerId = async (managerId) => {
  const resp = { status: 'false' };

  try {
    const pool = await poolPromise;
    const postWithViews = await pool
      .request()
      .input('managerId', managerId)
      .query(QUERIES.GET_POST_VIEW_BY_MANAGER_ID);
    console.log(postWithViews.recordset);
    const postWithNoViews = await pool
      .request()
      .input('managerId', managerId)
      .query(QUERIES.GET_UNEXISTS_POST_VIEW_BY_MANAGER_ID);
    console.log(postWithNoViews.recordset);

    const { recordset: withViews } = postWithViews;
    const { recordset: withNoViews } = postWithNoViews;
    const mappedWithNoViews = withNoViews.map((data) => ({ ...data, views: 0 }));

    resp.status = 'true';
    resp.message = [...withViews, ...mappedWithNoViews];

    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getOverviewData = async (params, id) => {
  const resp = { status: 'false' };
  const OVERVIEW_OPTIONS = {
    BRIEF: {
      input: 'briefId',
      query: QUERIES.GET_OVERVIEW_BY_BRIEF_ID
    },
    MANAGER: {
      input: 'managerId',
      query: QUERIES.GET_OVERVIEW_BY_MANAGER_ID
    },
    KOL_CATEGORY: {
      input: 'kolCategoryId',
      query: QUERIES.GET_OVERVIEW_BY_KOL_CATEGORY_ID
    },
    KOL: {
      input: 'kolId',
      query: QUERIES.GET_OVERVIEW_BY_KOL_ID
    }
  };

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input(OVERVIEW_OPTIONS[params].input, id)
      .query(OVERVIEW_OPTIONS[params].query);
    console.log(result.recordset);

    const { recordset } = result;
    resp.status = 'true';
    resp.message = recordset;

    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getCostAndSlotOverview = async () => {
  const resp = { status: 'false' };

  try {
    const pool = await poolPromise;
    const totalCostResult = await pool
      .request()
      .query(QUERIES.GET_TOTAL_COST_AND_SLOT);
    console.log(totalCostResult.recordset);

    const spentCostResult = await pool
      .request()
      .query(QUERIES.GET_UPLOADED_COST_AND_SLOT);
    console.log(spentCostResult.recordset);

    const { recordset: totalCost } = totalCostResult;
    const { recordset: spentCost } = spentCostResult;
    const totalCostData = totalCost[0];
    const spentCostData = spentCost[0];
    const remainingCostData = {
      cost: totalCostData.cost - spentCostData.cost,
      slot: totalCostData.slot - spentCostData.slot
    };
    console.log(remainingCostData);
    resp.status = 'true';
    resp.message = {
      totalCostData,
      spentCostData,
      remainingCostData
    };

    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const postReminderScheduler = async () => {
  const resp = { status: 'false' };
  const dayToFetch = [1, 3];

  try {
    const pool = await poolPromise;
    const query = QUERIES.GET_NOT_UPLOADED_POST;
    const result = await pool.request().query(query);

    const { recordset = [] } = result;
    const postsToBeUpdated = recordset.filter((data) => dayToFetch.includes(data.deadline));
    console.log('Reminder:', postsToBeUpdated);

    const messagePayload = postsToBeUpdated.map((data) => {
      const { kolName, deadlineDate, phoneNumber } = data;
      const message = getPostReminderTemplate(kolName, deadlineDate);
      return {
        number: `${phoneNumber}@c.us`,
        message
      };
    });

    messagePayload.forEach(async (message) => {
      await WhatsappConnector.sendMessage(message);
      console.log('send message to phone', message.number);
    });

    return true;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const contractReminderScheduler = async () => {
  const resp = { status: 'false' };
  const dayToFetch = [7, 14];

  try {
    const pool = await poolPromise;
    const query = QUERIES.GET_CONTRACT_RENEWAL_LIST;
    const result = await pool.request().query(query);

    const { recordset = [] } = result;
    const kolList = recordset.filter((data) => dayToFetch.includes(data.dateDifference));
    console.log('Reminder:', kolList);

    const messagePayload = kolList.map((data) => {
      const { phoneNumber } = data;
      const message = getContractReminderTemplate(data);
      return {
        number: `${phoneNumber}@c.us`,
        message
      };
    });

    messagePayload.forEach(async (message) => {
      await WhatsappConnector.sendMessage(message);
      console.log('send message to phone', message.number);
    });

    return true;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const getKolListByBrief = async (briefId) => {
  const resp = { status: 'false' };

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('briefId', briefId)
      .query(QUERIES.GET_KOL_LIST_BY_BRIEF_ID);
    console.log(result.recordset);

    const { recordset } = result;
    resp.status = 'true';
    resp.message = recordset;

    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getActiveKol = async () => {
  const resp = { status: 'false' };

  try {
    const pool = await poolPromise;
    const kolResult = await pool
      .request()
      .query(QUERIES.GET_ACTIVE_KOL);
    const { recordset } = kolResult;

    const activeKol = recordset.filter((data) => data.isHasActiveContract === 'YES');

    resp.status = 'true';
    resp.message = activeKol;

    return resp;
  } catch (error) {
    console.log('error yaw', error);
    return resp;
  }
};

const sendBriefToDestination = async (payload) => {
  const resp = { status: 'false' };
  const { params, destination, briefId } = payload;

  try {
    const pool = await poolPromise;
    const kolResult = await pool
      .request()
      .query(QUERIES.GET_ACTIVE_KOL);
    const { recordset } = kolResult;

    const recipient = recordset.filter((data) => (params === 'kol'
      ? destination.includes(data.kolId) && data.isHasActiveContract === 'YES'
      : destination.includes(data.kolCategoryId) && data.isHasActiveContract === 'YES'));

    const briefResult = await pool
      .request()
      .input('briefId', briefId)
      .query(QUERIES.GET_BRIEF_DETAIL);
    const { recordset: briefRecordset } = briefResult;
    const brief = briefRecordset[0];

    const messagePayload = recipient.map((data) => {
      const { phoneNumber, kolName } = data;
      const message = getBroadcastBriefTemplate({ ...brief, kolName });

      return {
        number: `${phoneNumber}@c.us`,
        message
      };
    });

    for (const message of messagePayload) {
      const result = await WhatsappConnector.sendMessage(message);
      if (result.status === 'true') {
        resp.status = 'true';
        console.log('hai', resp);
      }
      console.log('send message to phone', message.number);
    }

    return resp;
  } catch (error) {
    console.log('error yaw', error);
    return resp;
  }
};

const getMonthlyOverview = async () => {
  const resp = { status: 'false' };

  try {
    const pool = await poolPromise;
    const { recordset: monthlyViews } = await pool
      .request()
      .query(QUERIES.GET_MAX_VIEW_PER_MONTH);
    console.log(monthlyViews);

    const { recordset: monthlyCpm } = await pool
      .request()
      .query(QUERIES.GET_MAX_CPM_PER_MONTH);
    console.log(monthlyCpm);

    const mergedData = monthlyViews.map((data) => {
      const {
        views: maxViews, yearMonth, kolName: kolMaxViews, platform: platforMaxViews
      } = data;
      const [cpmData] = monthlyCpm.filter((cpm) => cpm.yearMonth === yearMonth);
      const { cpm: maxCpm, kolName: kolMaxCpm, platform: platformMaxCpm } = cpmData;
      console.log(cpmData);

      return {
        maxViews, yearMonth, kolMaxViews, platforMaxViews, maxCpm, kolMaxCpm, platformMaxCpm
      };
    });

    resp.status = 'true';
    resp.message = mergedData;

    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getBankList = async () => {
  const resp = { status: 'false' };
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query(QUERIES.GET_BANK_LIST);
    console.log(result.recordset);

    const { recordset } = result;
    resp.status = 'true';
    resp.message = recordset;

    return resp;
  } catch (err) {
    console.error(err);
    return resp;
  }
};

const updateKolById = async (id, payload) => {
  const resp = { status: 'false' };
  try {
    const {
      jenisEndorse,
      platform,
      kolCategory,
      name,
      username,
      phoneNumber,
      address,
      rekening,
      ktp,
      bank
    } = payload;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('jenisEndorse', jenisEndorse)
      .input('platform', platform)
      .input('kolCategory', kolCategory)
      .input('name', name)
      .input('username', username)
      .input('phoneNumber', phoneNumber)
      .input('address', address)
      .input('rekening', rekening)
      .input('ktp', ktp)
      .input('bank', bank)
      .input('id', id)
      .query(QUERIES.UPDATE_KOL);
    resp.status = 'true';
    resp.message = result.recordset;

    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const updateKontrakById = async (id, payload) => {
  const resp = { status: 'false' };
  try {
    const {
      subMedia,
      bookingSlot,
      biayaKerjaSama,
      managerId,
      tanggalAwalKerjaSama,
      tanggalAkhirKerjaSama,
      dp
    } = payload;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('subMedia', subMedia)
      .input('bookingSlot', bookingSlot)
      .input('biayaKerjaSama', biayaKerjaSama)
      .input('managerId', managerId)
      .input('tanggalAwalKerjaSama', tanggalAwalKerjaSama)
      .input('tanggalAkhirKerjaSama', tanggalAkhirKerjaSama)
      .input('dp', dp)
      .input('id', id)
      .query(QUERIES.UPDATE_KONTRAK);

    await pool
      .request()
      .input('subMedia', subMedia)
      .input('id', id)
      .query(QUERIES.UPDATE_KONTRAK_STATUS);
    resp.status = 'true';
    resp.message = result.recordset;

    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  insertNewKOL,
  getFormatListKol,
  getListKol,
  getALLKolName,
  getKolDetailByID,
  getSubMediaById,
  insertNewKontrak,
  getListKontrak,
  getKontrakDetailByID,
  insertNewBrief,
  getListBrief,
  insertNewManager,
  procToSendEmail,
  sendMessageToQueue,
  getListManager,
  getListKontrakIteration,
  insertNewPost,
  checkFileStatus,
  execSPWithoutInput,
  execSPWithInput,
  updatePostStatsById,
  getPostDetail,
  updatePostById,
  updatePostStatisticScheduler,
  _insertPostStatistic,
  getPostStatisticByPostId,
  getContractRenewalList,
  getBriefDetail,
  getPostViewByManagerId,
  getOverviewData,
  getCostAndSlotOverview,
  postReminderScheduler,
  contractReminderScheduler,
  getKolListByBrief,
  sendBriefToDestination,
  getMonthlyOverview,
  getBankList,
  getActiveKol,
  updateKolById,
  updateKontrakById
};
