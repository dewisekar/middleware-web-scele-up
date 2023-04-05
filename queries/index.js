const QUERIES = {
  GET_POST_DETAIL_QUERY: `SELECT 
    a.[Tgl Post Sesuai Jadwal] as deadlineDate, 
    a.[Tgl Post Real] as uploadDate,
    a.[Post Id] as postId,
    a.[Kontrak Id] as contractId,
    a.[Link Post] as linkPost,
    c.[Name] + ' (' + CONVERT(VARCHAR,d.[Kontrak Ke]) + ')' as contractName,
    c.[Name] as kolName,
    c.Platform as platform,
    c.Username as username,
    a.[Slot Ke] as  slotNumber,
    e.[Tema] as briefName,
    f.[Brief Code] as briefCode,
    g.[Manager Name] as kolManager,
    g.[Manager Id] as managerId,
    d.[Kontrak Ke]  as contractNumber,
    d.[Cost Per Slot] as costPerSlot,
    a.isFyp as isFyp,
    a.isFreeSlot as isFreeSlot
    FROM [MARKETING].dbo.Post a
    JOIN [MARKETING].dbo.[Kol Kontrak] b WITH(NOLOCK) on a.[Kontrak Id] = b.[Kontrak Id]
    JOIN [MARKETING].dbo.Kol c WITH(NOLOCK) on b.[Kol Id] = c.[Kol Id] 
    JOIN [MARKETING].dbo.[Kol Kontrak Status] d WITH(NOLOCK) on d.[Kontrak Id] = a.[Kontrak Id] 
    JOIN [MARKETING].dbo.Brief e WITH(NOLOCK) on a.[Brief Id] = e.[Brief Id] 
    JOIN [MARKETING].dbo.[Brief Status] f WITH(NOLOCK) ON e.[Brief Id] = f.[Brief Id]
    JOIN [MARKETING].dbo.[Kol Manager] g ON a.[Manager Id] = g.[Manager Id] 
    WHERE a.[Post Id] = @postId`,
  GET_CONTRACT_DETAIL_QUERY: `SELECT a.* ,
b.Name as kolName,
b.Username as username,
b.Platform as platform,
b.Jenis as kolType,
f.[category] as kolCategory,
b.[No Whatsapp] as kolPhone,
c.[Kontrak Ke] as contractNumber,
e.[Manager Name] as managerName,
e.NoKTP as managerKtp,
e.ROLES as managerRole,
c.[Cost Per Slot] as costPerSlot,
c.[Sisa Slot],
c.[Slot Terupload],
b.KTP as kolKtp, 
b.[Alamat KOL] as kolAddress,
g.name as kolBank,
b.[Nomor Rekening] as kolRekening,
CASE 
When DATEDIFF(day, getDate() , a.[Masa Kontrak Akhir] ) <= 30 and DATEDIFF(day, getDate() , a.[Masa Kontrak Akhir] ) >=0 THEN 'PERLU DIPERBARUI'
WHEN DATEDIFF(day, getDate() , a.[Masa Kontrak Akhir] ) < 0 THEN 'TIDAK AKTIF'
WHEN c.[Slot Terupload] = a.[Booking Slot] THEN 'SLOT PENUH'
else 'AKTIF'
END as contractStatus,
(SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL) as uploadedPost,
a.[Booking Slot] - (SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL) as missedPost
from [MARKETING].[dbo].[Kol Kontrak] a
JOIN MARKETING.dbo.Kol b ON b.[Kol Id] = a.[Kol Id]
JOIN MARKETING.dbo.[Kol Kontrak Status] c on c.[Kontrak Id] = a.[Kontrak Id] 
JOIN MARKETING.dbo.[Kol Manager] e on e.[Manager Id] = a.[Manager Id] 
JOIN MARKETING.dbo.[KolCategory] f on f.[id] = b.[Kategori Kol] 
JOIN MARKETING.dbo.bank g on g.[code] = b.[BANK] 
where a.[Kontrak Id] = @contractId`,
  UPDATE_POST_QUERY: `UPDATE MARKETING.dbo.Post
    SET [Tgl Post Sesuai Jadwal]=@deadlineDate, [Tgl Post Real]=@uploadDate, [Link Post]=@linkPost, LastUpdateStats=getDate(), [isFyp] = @isFyp, [isFreeSlot] = @isFreeSlot 
    WHERE [Post Id]=@postId;`,
  GET_UPLOADED_POST: `SELECT a.[Post Id] as postId, 
  a.[Tgl Post Sesuai Jadwal] as deadlineDate, 
  a.[Tgl Post Real] as uploadDate, 
  a.[Kontrak Id] as contractId, 
  a.[Manager Id] as managerId, 
  a.[Brief Id] as briefId, 
  a.[Link Post] as linkPost, 
  a.[Slot Ke] as slotNumber, 
  DATEDIFF(day,[Tgl Post Real], getdate()) as dateDifference
  FROM MARKETING.dbo.Post a
  JOIN MARKETING.dbo.[Kol Kontrak] b on b.[Kontrak Id] = a.[Kontrak Id] 
  JOIN MARKETING.dbo.Kol c on c.[Kol Id] = b.[Kol Id] 
  WHERE [Tgl Post Real] IS  NOT NULL and c.Platform = 'Tiktok'`,
  INSERT_NEW_LOG: `INSERT INTO MARKETING.dbo.Log_Marketing
    (Waktu, Query, [User], RESPONSE_MESSAGE)
    VALUES(getDate() , @query, @user, @responseMessage);`,
  GET_POST_STATISTIC_BY_POST_ID: `SELECT postId, followers, comments, 
    likes, shares, views, id, dayNumber, createdAt
    FROM MARKETING.dbo.Post_View
    WHERE postId = @postId
    ORDER BY dayNumber ASC;`,
  GET_CONTRACT_RENEWAL_LIST: `SELECT 
    a.[Kontrak Id] as contractId,
    b.Name as kolName,
    b.platform as platform,
    c.[Kontrak Ke] as contractNumber,
    DATEDIFF(day, getDate() , [Masa Kontrak Akhir]) as dateDifference,
    a.[Booking Slot] as totalSlot,
    a.[Masa Kontrak Akhir] as contractEndDate,
    b.[No Whatsapp] as phoneNumber,
    (SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL) as uploadedPost,
    a.[Booking Slot] - (SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL) as missedPost
    FROM MARKETING.dbo.[Kol Kontrak] a
    JOIN MARKETING.dbo.Kol b ON b.[Kol Id] = a.[Kol Id]
    JOIN MARKETING.dbo.[Kol Kontrak Status] c ON c.[Kontrak Id] = a.[Kontrak Id] 
    WHERE DATEDIFF(day, getDate() ,[Masa Kontrak Akhir]) <= 30 AND DATEDIFF(day, getDate() ,[Masa Kontrak Akhir]) >=0`,
  GET_BRIEF_DETAIL: `SELECT a.[Brief Id] as briefId,
    b.[Brief Code] AS briefCode,
    a.[Tema] as theme,
    a.[Konsep] as concept,
    a.[Link Referensi Video] as reference,
    a.[Script] as script,
    b.[Brief Code]+ ' - ' + a.[Tema] as briefCodeTheme,
    c.[Manager Name] as managerName,
    a.link as link
    FROM  MARKETING.dbo.Brief a WITH(NOLOCK) 
    LEFT JOIN MARKETING.dbo.[Brief Status] b WITH(NOLOCK) on a.[Brief Id] = b.[Brief Id]
    LEFT JOIN MARKETING.dbo.[Kol Manager] c WITH(NOLOCK) on a.[Manager Id] = c.[Manager Id]
    where a.[Brief Id] = @briefId`,
  GET_POST_BY_MANAGER_ID: `SELECT 
    g.Name + ' - (' + CONVERT(VARCHAR,  f.[Kontrak Ke]) +')' as contractName,
    a.[Tgl Post Real] as uploadDate,
    g.Username as username, 
    a.[Link Post] as linkPost,
    h.[Manager Name] as managerName
    from MARKETING.dbo.Post a
    JOIN MARKETING.dbo.[Kol Kontrak] e on a.[Kontrak Id] = e.[Kontrak Id] 
    JOIN MARKETING.dbo.[Kol Kontrak Status] f on f.[Kontrak Id] = a.[Kontrak Id] 
    JOIN MARKETING.dbo.Kol g on e.[Kol Id] = g.[Kol Id] 
    JOIN MARKETING.dbo.[Kol Manager] h on h.[Manager Id] = a.[Manager Id] 
    WHERE a.[Manager Id] = @managerId and a.[Tgl Post Real] is not null
    order by a.[Post Id]`,
  GET_POST_VIEW_BY_MANAGER_ID: `SELECT 
    g.Name + ' - (' + CONVERT(VARCHAR,  f.[Kontrak Ke]) +')' as contractName,
    a.[Tgl Post Real] as uploadDate,
    g.Username as username, 
    a.[Link Post] as linkPost,
    h.[Manager Name] as managerName,
    f.[Cost Per Slot] as costPerSlot,
    b.*
    from MARKETING.dbo.Post a
    left JOIN MARKETING.dbo.Post_View b on a.[Post Id] = b.postId 
    JOIN MARKETING.dbo.Brief c on a.[Brief Id] = c.[Brief Id] 
    JOIN MARKETING.dbo.[Brief Status] d on c.[Brief Id] = d.[Brief Id] 
    JOIN MARKETING.dbo.[Kol Kontrak] e on a.[Kontrak Id] = e.[Kontrak Id] 
    JOIN MARKETING.dbo.[Kol Kontrak Status] f on f.[Kontrak Id] = a.[Kontrak Id] 
    JOIN MARKETING.dbo.Kol g on e.[Kol Id] = g.[Kol Id] 
    JOIN MARKETING.dbo.[Kol Manager] h on h.[Manager Id] = a.[Manager Id] 
    WHERE a.[Manager Id] = @managerId and a.[Tgl Post Real] is not null and b.dayNumber = 7
    order by a.[Tgl Post Real] asc`,
  GET_UNEXISTS_POST_VIEW_BY_MANAGER_ID: `SELECT 
    g.Name + ' - (' + CONVERT(VARCHAR,  f.[Kontrak Ke]) +')' as contractName,
    a.[Tgl Post Real] as uploadDate,
    g.Username as username, 
    a.[Link Post] as linkPost,
    h.[Manager Name] as managerName,
    f.[Cost Per Slot] as costPerSlot
    from MARKETING.dbo.Post a
    JOIN MARKETING.dbo.[Kol Kontrak] e on a.[Kontrak Id] = e.[Kontrak Id] 
    JOIN MARKETING.dbo.[Kol Kontrak Status] f on f.[Kontrak Id] = a.[Kontrak Id] 
    JOIN MARKETING.dbo.Kol g on e.[Kol Id] = g.[Kol Id] 
    JOIN MARKETING.dbo.[Kol Manager] h on h.[Manager Id] = a.[Manager Id] 
    WHERE a.[Manager Id] = @managerId and a.[Tgl Post Real] is not null
    and a.[Post Id] not in 
    (select i.[Post Id] 
    from MARKETING.dbo.Post i 
    join MARKETING.dbo.Post_View j on j.postId = i.[Post Id] 
    where i.[Manager Id]= @managerId and j.dayNumber = 7)
    order by a.[Post Id]`,
  GET_OVERVIEW_BY_BRIEF_ID: `SELECT AVG(views) as avgViews, 
  SUM(views) as totalViews,
  COUNT(views) as numberOfPost, 
  SUM(c.[Cost Per Slot]) as totalCostPerSlot,
  COALESCE( SUM(c.[Cost Per Slot])/NULLIF (SUM(views), 0)*1000, 0) as avgCpm,
  CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2)  as yearMonth
  FROM MARKETING.dbo.Post_View a
  JOIN MARKETING.dbo.Post b on a.postId = b.[Post Id] 
  JOIN MARKETING.dbo.[Kol Kontrak Status] c on b.[Kontrak Id] = c.[Kontrak Id] 
  where a.dayNumber = 7 and b.[Brief Id] = @briefId
  GROUP BY 
  CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2)`,
  GET_OVERVIEW_BY_MANAGER_ID: `SELECT AVG(views) as avgViews, 
  SUM(views) as totalViews,
  COUNT(views) as numberOfPost, 
  SUM(c.[Cost Per Slot]) AS totalCostPerSlot,
   COALESCE( SUM(c.[Cost Per Slot])/NULLIF (SUM(views), 0)*1000, 0) as avgCpm,
  CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2)  as yearMonth
  FROM MARKETING.dbo.Post_View a
  JOIN MARKETING.dbo.Post b on a.postId = b.[Post Id] 
  JOIN MARKETING.dbo.[Kol Kontrak Status] c on b.[Kontrak Id] = c.[Kontrak Id] 
  where a.dayNumber = 7 and b.[Manager Id] = @managerId
  GROUP BY 
  CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2)`,
  GET_OVERVIEW_BY_KOL_CATEGORY_ID: `SELECT AVG(views) as avgViews, 
  SUM(views) as totalViews,
  COUNT(views) as numberOfPost, 
  SUM(c.[Cost Per Slot]) as totalCostPerSlot,
   COALESCE( SUM(c.[Cost Per Slot])/NULLIF (SUM(views), 0)*1000, 0) avgCpm,
  CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2)  as yearMonth
  FROM MARKETING.dbo.Post_View a
  JOIN MARKETING.dbo.Post b on a.postId = b.[Post Id] 
  JOIN MARKETING.dbo.[Kol Kontrak Status] c on b.[Kontrak Id] = c.[Kontrak Id] 
  JOIN MARKETING.dbo.[Kol Kontrak] d on d.[Kontrak Id] = b.[Kontrak Id] 
  JOIN MARKETING.dbo.Kol e on e.[Kol Id] = d.[Kol Id] 
  JOIN MARKETING.dbo.KolCategory f on f.id = e.[Kategori Kol] 
  where a.dayNumber = 7 and f.id = @kolCategoryId
  GROUP BY 
  CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2)`,
  GET_OVERVIEW_BY_KOL_ID: `SELECT AVG(views) as avgViews, 
  SUM(views) as totalViews,
  COUNT(views) as numberOfPost, 
  CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2)  as yearMonth,
  SUM(e.[Cost Per Slot]) as totalCostPerSlot,
  COALESCE( SUM(e.[Cost Per Slot])/NULLIF (SUM(views), 0)*1000, 0) avgCpm
  FROM MARKETING.dbo.Post_View a
  JOIN MARKETING.dbo.Post b on a.postId = b.[Post Id] 
  JOIN MARKETING.dbo.[Kol Kontrak Status] c on b.[Kontrak Id] = c.[Kontrak Id] 
  JOIN MARKETING.dbo.[Kol Kontrak] d on d.[Kontrak Id] = b.[Kontrak Id] 
  JOIN MARKETING.dbo.[Kol Kontrak Status] e on e.[Kontrak Id] = b.[Kontrak Id] 
  where a.dayNumber = 7 and d.[Kol Id] = @kolId
  GROUP BY 
  CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2)`,
  GET_TOTAL_COST_AND_SLOT: `Select SUM(a.[Booking Slot]) as slot,
    SUM(a.[Total Kerjasama]) as cost
    From MARKETING.dbo.[Kol Kontrak] a`,
  GET_UPLOADED_COST_AND_SLOT: `Select SUM(b.[Cost Per Slot]) as cost, COUNT(a.[Post Id]) as slot
    From MARKETING.dbo.Post a
    JOIN MARKETING.dbo.[Kol Kontrak Status] b on a.[Kontrak Id] = b.[Kontrak Id] 
    WHERE a.[Tgl Post Real] IS NOT NULL`,
  GET_NOT_UPLOADED_POST: `SELECT c.Name as kolName,
    a.[Tgl Post Sesuai Jadwal] as deadlineDate,
    c.[No Whatsapp] as phoneNumber,
    DATEDIFF(day, getDate() , a.[Tgl Post Sesuai Jadwal]) as deadline
    FROM MARKETING.dbo.Post a
    JOIN MARKETING.dbo.[Kol Kontrak] b on a.[Kontrak Id] = b.[Kontrak Id] 
    JOIN MARKETING.dbo.Kol c on b.[Kol Id] = c.[Kol Id] 
    WHERE a.[Tgl Post Real] IS NULL`,
  GET_KOL_LIST_BY_BRIEF_ID: `SELECT DISTINCT c.Name as kolName
    FROM MARKETING.dbo.Post a
    JOIN MARKETING.dbo.[Kol Kontrak] b on a.[Kontrak Id] = b.[Kontrak Id] 
    JOIN MARKETING.dbo.Kol c on c.[Kol Id] = b.[Kol Id] 
    WHERE a.[Brief Id] = @briefId`,
  INSERT_FILE_MOU: `INSERT INTO MARKETING.dbo.[File Mou]
    ([File Name], [Progress Status], [Inserted Date], [Last Update Date], [Contract Id])
    VALUES(@fileName, 2, GETDATE(), GETDATE(), @contractId);`,
  UPDATE_FILE_MOU: `UPDATE MARKETING.dbo.[File Mou]
    SET [File Name]=@fileName, [Last Update Date]=GETDATE()
    WHERE [Contract Id]=@contractId;`,
  GET_MAX_VIEW_PER_MONTH: `SELECT  a.postId, c.views, CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) as yearMonth,
    e.Name as kolName, e.Platform as platform
    from MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post b on b.[Post Id] = a.postId 
    JOIN (
    SELECT max(a.views) as views, CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) as yearMonth
    from MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post b on b.[Post Id] = a.postId 
    GROUP BY CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2)
    ) as c on c.yearMonth = CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) and a.views = c.views
    JOIN MARKETING.dbo.[Kol Kontrak] d on d.[Kontrak Id] = b.[Kontrak Id] 
    JOIN MARKETING.dbo.Kol e on e.[Kol Id] = d.[Kol Id] `,
  GET_MAX_CPM_PER_MONTH: `SELECT right('00' + CAST(MONTH(c.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(c.[Tgl Post Real]) AS VARCHAR(4))  as yearMonth,
  COALESCE(d.[Cost Per Slot]/NULLIF (a.views, 0)*1000, 0) as cpm, f.Name as kolName, f.Platform as platform
    FROM MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post c on a.postId = c.[Post Id] 
    JOIN MARKETING.dbo.[Kol Kontrak Status] d on c.[Kontrak Id] = d.[Kontrak Id]
    JOIN
    (
    SELECT MAX(COALESCE(c.[Cost Per Slot]/NULLIF (a.views, 0)*1000, 0)) as maxCpm,
    CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2)  as yearMonth
    FROM MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post b on a.postId = b.[Post Id]
    JOIN MARKETING.dbo.[Kol Kontrak Status] c on c.[Kontrak Id] = b.[Kontrak Id] 
    where a.dayNumber = 7
    GROUP BY 
    CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))+'-'+right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2)
    ) as b on b.yearMonth = right('00' + CAST(MONTH(c.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(c.[Tgl Post Real]) AS VARCHAR(4)) 
    JOIN MARKETING.dbo.[Kol Kontrak] e on e.[Kontrak Id] = c.[Kontrak Id]
    JOIN MARKETING.dbo.Kol f on f.[Kol Id] = e.[Kol Id] 
    WHERE b.maxCpm = (COALESCE(d.[Cost Per Slot]/NULLIF (a.views, 0)*1000, 0))`,
  GET_BANK_LIST: 'SELECT * FROM MARKETING.dbo.bank',
  GET_ACTIVE_KOL: `select DISTINCT a.Name as kolName, a.[No Whatsapp] as phoneNumber, a.[Kol Id] as kolId, a.[Platform] as platform, a.[Kategori Kol] as kolCategoryId, 
  CAST(CASE WHEN b.[Kontrak Id] is NOT NULL AND DATEDIFF(day, getDate() , b.[Masa Kontrak Akhir] ) > 0  THEN 'YES' ELSE 'NO' END AS varchar) as isHasActiveContract
  from marketing.dbo.Kol a
  left Join MARKETING.dbo.[Kol Kontrak] b on a.[Kol Id] = b.[Kol Id]`,
  UPDATE_KOL: `UPDATE MARKETING.dbo.Kol
  SET  Platform=@platform, Jenis=@jenisEndorse, Name=@name, Username=@username, [Nomor Rekening]=@rekening, [Alamat KOL]=@address, [No Whatsapp]=@phoneNumber, KTP=@ktp, BANK=@bank, [Kategori Kol]=@kolCategory
  WHERE [Kol Id]=@id;`,
  UPDATE_KONTRAK: `UPDATE MARKETING.dbo.[Kol Kontrak]
  SET [Sub Media]=@subMedia, [Booking Slot]=@bookingSlot, [Total Kerjasama]=@biayaKerjaSama, [Masa Kontrak Mulai]=@tanggalAwalKerjaSama, [Masa Kontrak Akhir]=@tanggalAkhirKerjaSama, [Manager Id]=@managerId, DP=@dp
  WHERE [Kontrak Id]=@id;
  `,
  UPDATE_KONTRAK_STATUS: `UPDATE MARKETING.dbo.[Kol Kontrak Status]
  SET [Sub Media]=@subMedia
  WHERE [Kontrak Id]=@id;
  `,
  GET_NUMBER_OF_ACTIVE_KOL: `SELECT COUNT(DISTINCT(a.[Kol Id])) as numberOfActiveKol
    from MARKETING.dbo.[Kol Kontrak] a
    WHERE 
    (
      (a.[Booking Slot] - (SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL))>0
      and YEAR(a.[Masa Kontrak Akhir]) >=2023
    ) or a.[Masa Kontrak Akhir] >= GETDATE()`,
  GET_NUMBER_OF_AVAILABLE_SLOT: `SELECT SUM((a.[Booking Slot]-b.totalUploadedPost)) as totalSlotLeft
    from MARKETING.dbo.[Kol Kontrak] a
    JOIN (SELECT COUNT(*) as totalUploadedPost, a.[Kontrak Id] as kontrakId
    FROM MARKETING.dbo.Post a 
    WHERE a.[Link Post] IS NOT NULL  group by a.[Kontrak Id]) b on b.kontrakId = a.[Kontrak Id] 
    WHERE YEAR(a.[Masa Kontrak Mulai])>=2023 AND  (a.[Booking Slot]-b.totalUploadedPost)> 0`,
  GET_PLANNED_SLOT_PER_YEAR: `SELECT SUM(b.[Cost Per Slot]) as totalSlotAvailable, MONTH(a.[Tgl Post Sesuai Jadwal]) as month
    FROM MARKETING.dbo.Post a
    JOIN MARKETING.dbo.[Kol Kontrak Status] b on a.[Kontrak Id] = b.[Kontrak Id] 
    WHERE a.[Link Post] IS NULL AND YEAR(a.[Tgl Post Sesuai Jadwal]) = @year
    GROUP BY MONTH(a.[Tgl Post Sesuai Jadwal])`,
  GET_USED_SLOT_PER_YEAR: `SELECT SUM(b.[Cost Per Slot]) as totalSlotUsed, MONTH(a.[Tgl Post Sesuai Jadwal]) as month
    FROM MARKETING.dbo.Post a
    JOIN MARKETING.dbo.[Kol Kontrak Status] b on a.[Kontrak Id] = b.[Kontrak Id] 
    WHERE a.[Link Post] IS NOT NULL AND YEAR(a.[Tgl Post Sesuai Jadwal]) = @year
    GROUP BY MONTH(a.[Tgl Post Sesuai Jadwal])`,
  GET_NUMBER_OF_POSTS_OF_THE_MONTH: `SELECT COUNT(*) as wtotalPost FROM MARKETING.dbo.Post a
    where YEAR(a.[Tgl Post Sesuai Jadwal]) = @year AND MONTH(a.[Tgl Post Sesuai Jadwal])=@month`,
  GET_NUMBER_OF_POSTS_TO_BE_FOLLOWED_UP: `SELECT COUNT(*) as totalPost FROM MARKETING.dbo.Post a
    WHERE( DATEDIFF(DAY, GETDATE(), a.[Tgl Post Sesuai Jadwal])=0 AND a.[Link Post] is NULL ) 
    OR (a.[Tgl Post Sesuai Jadwal] < GETDATE() AND a.[Link Post] IS NULL)`,
  GET_KOL_CATEGORY_BY_NAME: 'SELECT id, category, createdAt FROM MARKETING.dbo.KolCategory WHERE category = @category AND (@id is null or id != @id)',
  INSERT_KOL_CATEGORY: 'INSERT INTO MARKETING.dbo.KolCategory (category, createdAt) VALUES(@category, GETDATE())',
  UPDATE_KOL_CATEGORY: 'UPDATE MARKETING.dbo.KolCategory SET category=@category WHERE id=@id; '
};

module.exports = { QUERIES };
