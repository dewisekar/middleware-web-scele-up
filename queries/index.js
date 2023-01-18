const QUERIES = {
GET_POST_DETAIL_QUERY : `SELECT 
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
b.[Kategori KOL] as kolCategory,
b.[No Whatsapp] as kolPhone,
c.[Kontrak Ke] as contractNumber,
e.[Manager Name] as managerName,
c.[Cost Per Slot] as costPerSlot,
c.[Sisa Slot],
c.[Slot Terupload],
CASE 
	When DATEDIFF(day, GETDATE(), a.[Masa Kontrak Akhir] ) <= 30 and DATEDIFF(day, GETDATE(), a.[Masa Kontrak Akhir] ) >=0 THEN 'PERLU DIPERBARUI'
	WHEN DATEDIFF(day, GETDATE(), a.[Masa Kontrak Akhir] ) < 0 THEN 'TIDAK AKTIF'
	WHEN c.[Slot Terupload] = a.[Booking Slot] THEN 'SLOT PENUH'
	else 'AKTIF'
END as contractStatus,
(SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL) as uploadedPost,
a.[Booking Slot] - (SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL) as missedPost
from [MARKETING].[dbo].[Kol Kontrak] a
JOIN MARKETING.dbo.Kol b ON b.[Kol Id] = a.[Kol Id]
JOIN MARKETING.dbo.[Kol Kontrak Status] c on c.[Kontrak Id] = a.[Kontrak Id] 
JOIN MARKETING.dbo.[Kol Manager] e on e.[Manager Id] = a.[Manager Id] 
where a.[Kontrak Id] = @contractId`,
UPDATE_POST_QUERY: `UPDATE MARKETING.dbo.Post
    SET [Tgl Post Sesuai Jadwal]=@deadlineDate, [Tgl Post Real]=@uploadDate, [Link Post]=@linkPost, LastUpdateStats=getdate()
    WHERE [Post Id]=@postId;`,
GET_UPLOADED_POST: `SELECT [Post Id] as postId, 
    [Tgl Post Sesuai Jadwal] as deadlineDate, 
    [Tgl Post Real] as uploadDate, 
    [Kontrak Id] as contractId, 
    [Manager Id] as managerId, 
    [Brief Id] as briefId, 
    [Link Post] as linkPost, 
    [Slot Ke] as slotNumber, 
    DATEDIFF(day,[Tgl Post Real], GETDATE()) as dateDifference
    FROM MARKETING.dbo.Post
    WHERE [Tgl Post Real] IS NOT NULL`,
INSERT_NEW_LOG : `INSERT INTO MARKETING.dbo.Log_Marketing
    (Waktu, Query, [User], RESPONSE_MESSAGE)
    VALUES(GETDATE(), @query, @user, @responseMessage);`,
GET_POST_STATISTIC_BY_POST_ID: `SELECT postId, followers, comments, 
    likes, shares, views, id, dayNumber, createdAt
    FROM MARKETING.dbo.Post_View
    WHERE postId = @postId
    ORDER BY dayNumber ASC;`,
GET_CONTRACT_RENEWAL_LIST: `SELECT 
    a.[Kontrak Id] as contractId,
    b.Name as kolName,
    c.[Kontrak Ke] as contractNumber,
    DATEDIFF(day, GETDATE(), [Masa Kontrak Akhir]) as dateDifference,
    a.[Booking Slot] as totalSlot,
    a.[Masa Kontrak Akhir] as contractEndDate,
    (SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL) as uploadedPost,
    a.[Booking Slot] - (SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL) as missedPost
    FROM MARKETING.dbo.[Kol Kontrak] a
    JOIN MARKETING.dbo.Kol b ON b.[Kol Id] = a.[Kol Id]
    JOIN MARKETING.dbo.[Kol Kontrak Status] c ON c.[Kontrak Id] = a.[Kontrak Id] 
    WHERE DATEDIFF(day, GETDATE(),[Masa Kontrak Akhir]) <= 30 AND DATEDIFF(day, GETDATE(),[Masa Kontrak Akhir]) >=0`
}

module.exports =  {QUERIES}