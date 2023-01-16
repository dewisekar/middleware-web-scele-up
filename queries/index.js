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
GET_CONTRACT_DETAIL_QUERY: `select * from [MARKETING].[dbo].[Kol Kontrak] where [Kontrak Id] = @contractId`,
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
    DATEDIFF(day,[Masa Kontrak Akhir], GETDATE()) as dateDifference,
    a.[Booking Slot] as totalSlot,
    a.[Masa Kontrak Akhir] as contractEndDate,
    (SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL) as uploadedPost,
    a.[Booking Slot] - (SELECT COUNT(*) FROM MARKETING.dbo.Post d WHERE d.[Kontrak Id] = a.[Kontrak Id] AND d.[Tgl Post Real] IS NOT NULL) as missedPost
    FROM MARKETING.dbo.[Kol Kontrak] a
    JOIN MARKETING.dbo.Kol b ON b.[Kol Id] = a.[Kol Id]
    JOIN MARKETING.dbo.[Kol Kontrak Status] c ON c.[Kontrak Id] = a.[Kontrak Id] 
    WHERE DATEDIFF(day,[Masa Kontrak Akhir], GETDATE()) <= 30 AND DATEDIFF(day,[Masa Kontrak Akhir], GETDATE()) >=0`
}

module.exports =  {QUERIES}