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
    d.[Cost Per Slot] as costPerSlot
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
b.BANK as kolBank,
b.[Nomor Rekening] as kolRekening,
CASE 
When DATEDIFF(day, dateadd(HOUR, 7, getdate()) , a.[Masa Kontrak Akhir] ) <= 30 and DATEDIFF(day, dateadd(HOUR, 7, getdate()) , a.[Masa Kontrak Akhir] ) >=0 THEN 'PERLU DIPERBARUI'
WHEN DATEDIFF(day, dateadd(HOUR, 7, getdate()) , a.[Masa Kontrak Akhir] ) < 0 THEN 'TIDAK AKTIF'
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
where a.[Kontrak Id] = @contractId`,
  UPDATE_POST_QUERY: `UPDATE MARKETING.dbo.Post
    SET [Tgl Post Sesuai Jadwal]=@deadlineDate, [Tgl Post Real]=@uploadDate, [Link Post]=@linkPost, LastUpdateStats=dateadd(HOUR, 7, getdate()) 
    WHERE [Post Id]=@postId;`,
  GET_UPLOADED_POST: `SELECT a.[Post Id] as postId, 
  a.[Tgl Post Sesuai Jadwal] as deadlineDate, 
  a.[Tgl Post Real] as uploadDate, 
  a.[Kontrak Id] as contractId, 
  a.[Manager Id] as managerId, 
  a.[Brief Id] as briefId, 
  a.[Link Post] as linkPost, 
  a.[Slot Ke] as slotNumber, 
  DATEDIFF(day,[Tgl Post Real], dateadd(HOUR, 7, getdate()) ) as dateDifference
  FROM MARKETING.dbo.Post a
  JOIN MARKETING.dbo.[Kol Kontrak] b on b.[Kontrak Id] = a.[Kontrak Id] 
  JOIN MARKETING.dbo.Kol c on c.[Kol Id] = b.[Kol Id] 
  WHERE [Tgl Post Real] IS  NOT NULL and c.Platform = 'Tiktok'`,
  INSERT_NEW_LOG: `INSERT INTO MARKETING.dbo.Log_Marketing
    (Waktu, Query, [User], RESPONSE_MESSAGE)
    VALUES(dateadd(HOUR, 7, getdate()) , @query, @user, @responseMessage);`,
  GET_POST_STATISTIC_BY_POST_ID: `SELECT postId, followers, comments, 
    likes, shares, views, id, dayNumber, createdAt
    FROM MARKETING.dbo.Post_View
    WHERE postId = @postId
    ORDER BY dayNumber ASC;`,
  GET_CONTRACT_RENEWAL_LIST: `SELECT 
    a.[Kontrak Id] as contractId,
    b.Name as kolName,
    c.[Kontrak Ke] as contractNumber,
    DATEDIFF(day, dateadd(HOUR, 7, getdate()) , [Masa Kontrak Akhir]) as dateDifference,
    a.[Booking Slot] as totalSlot,
    a.[Masa Kontrak Akhir] as contractEndDate,
    b.[No Whatsapp] as phoneNumber,
    (SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL) as uploadedPost,
    a.[Booking Slot] - (SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL) as missedPost
    FROM MARKETING.dbo.[Kol Kontrak] a
    JOIN MARKETING.dbo.Kol b ON b.[Kol Id] = a.[Kol Id]
    JOIN MARKETING.dbo.[Kol Kontrak Status] c ON c.[Kontrak Id] = a.[Kontrak Id] 
    WHERE DATEDIFF(day, dateadd(HOUR, 7, getdate()) ,[Masa Kontrak Akhir]) <= 30 AND DATEDIFF(day, dateadd(HOUR, 7, getdate()) ,[Masa Kontrak Akhir]) >=0`,
  GET_BRIEF_DETAIL: `SELECT a.[Brief Id] as briefId,
    b.[Brief Code] AS briefCode,
    a.[Tema] as theme,
    a.[Konsep] as concept,
    a.[Link Referensi Video] as reference,
    a.[Script] as script,
    b.[Brief Code]+ ' - ' + a.[Tema] as briefCodeTheme,
    c.[Manager Name] as managerName
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
    AVG(c.[Cost Per Slot]/a.views*1000) as avgCpm,
    right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))  as yearMonth
    FROM MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post b on a.postId = b.[Post Id] 
    JOIN MARKETING.dbo.[Kol Kontrak Status] c on b.[Kontrak Id] = c.[Kontrak Id] 
    where a.dayNumber = 7 and b.[Brief Id] = @briefId
    GROUP BY 
    right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))`,
  GET_OVERVIEW_BY_MANAGER_ID: `SELECT AVG(views) as avgViews, 
    SUM(views) as totalViews,
    COUNT(views) as numberOfPost, 
    AVG(c.[Cost Per Slot]/a.views*1000) as avgCpm,
    right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))  as yearMonth
    FROM MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post b on a.postId = b.[Post Id] 
    JOIN MARKETING.dbo.[Kol Kontrak Status] c on b.[Kontrak Id] = c.[Kontrak Id] 
    where a.dayNumber = 7 and b.[Manager Id] = @managerId
    GROUP BY 
    right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))`,
  GET_OVERVIEW_BY_KOL_CATEGORY_ID: `SELECT AVG(views) as avgViews, 
    SUM(views) as totalViews,
    COUNT(views) as numberOfPost, 
    AVG(c.[Cost Per Slot]/a.views*1000) as avgCpm,
    right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))  as yearMonth
    FROM MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post b on a.postId = b.[Post Id] 
    JOIN MARKETING.dbo.[Kol Kontrak Status] c on b.[Kontrak Id] = c.[Kontrak Id] 
    JOIN MARKETING.dbo.[Kol Kontrak] d on d.[Kontrak Id] = b.[Kontrak Id] 
    JOIN MARKETING.dbo.Kol e on e.[Kol Id] = d.[Kol Id] 
    JOIN MARKETING.dbo.KolCategory f on f.id = e.[Kategori Kol] 
    where a.dayNumber = 7 and f.id = @kolCategoryId
    GROUP BY 
    right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))`,
  GET_OVERVIEW_BY_KOL_ID: `SELECT AVG(views) as avgViews, 
    SUM(views) as totalViews,
    COUNT(views) as numberOfPost, 
    AVG(c.[Cost Per Slot]/a.views*1000) as avgCpm,
    right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))  as yearMonth
    FROM MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post b on a.postId = b.[Post Id] 
    JOIN MARKETING.dbo.[Kol Kontrak Status] c on b.[Kontrak Id] = c.[Kontrak Id] 
    JOIN MARKETING.dbo.[Kol Kontrak] d on d.[Kontrak Id] = b.[Kontrak Id] 
    where a.dayNumber = 7 and d.[Kol Id] = @kolId
    GROUP BY 
    right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))`,
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
    DATEDIFF(day, dateadd(HOUR, 7, getdate()) , a.[Tgl Post Sesuai Jadwal]) as deadline
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
  GET_MAX_VIEW_PER_MONTH: `SELECT  a.postId, c.views, right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4)) as yearMonth,
    e.Name as kolName, e.Platform as platform
    from MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post b on b.[Post Id] = a.postId 
    JOIN (
    SELECT max(a.views) as views, right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4)) as yearMonth
    from MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post b on b.[Post Id] = a.postId 
    GROUP BY right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))
    ) as c on c.yearMonth = yearMonth
    JOIN MARKETING.dbo.[Kol Kontrak] d on d.[Kontrak Id] = b.[Kontrak Id] 
    JOIN MARKETING.dbo.Kol e on e.[Kol Id] = d.[Kol Id] 
    where a.views = c.views`,
  GET_MAX_CPM_PER_MONTH: `SELECT right('00' + CAST(MONTH(c.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(c.[Tgl Post Real]) AS VARCHAR(4))  as yearMonth,
    (d.[Cost Per Slot]/a.views*1000) as cpm, f.Name as kolName, f.Platform as platform
    FROM MARKETING.dbo.Post_View a
    JOIN
    (
    SELECT MAX(c.[Cost Per Slot]/a.views*1000) as maxCpm,
    right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))  as yearMonth
    FROM MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post b on a.postId = b.[Post Id]
    JOIN MARKETING.dbo.[Kol Kontrak Status] c on c.[Kontrak Id] = b.[Kontrak Id] 
    where a.dayNumber = 7
    GROUP BY 
    right('00' + CAST(MONTH(b.[Tgl Post Real]) AS VARCHAR(2)), 2) +'-'+ CAST(YEAR(b.[Tgl Post Real]) AS VARCHAR(4))
    ) as b on b.yearMonth = yearMonth
    JOIN MARKETING.dbo.Post c on a.postId = c.[Post Id] 
    JOIN MARKETING.dbo.[Kol Kontrak Status] d on c.[Kontrak Id] = d.[Kontrak Id] 
    JOIN MARKETING.dbo.[Kol Kontrak] e on e.[Kontrak Id] = c.[Kontrak Id]
    JOIN MARKETING.dbo.Kol f on f.[Kol Id] = e.[Kol Id] 
    WHERE b.maxCpm = (d.[Cost Per Slot]/a.views*1000)`,
  GET_BANK_LIST: 'SELECT * FROM MARKETING.dbo.bank'
};

module.exports = { QUERIES };
