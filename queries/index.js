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
    d.[Kontrak Ke]  as contractNumber
    FROM [MARKETING].dbo.Post a
    JOIN [MARKETING].dbo.[Kol Kontrak] b WITH(NOLOCK) on a.[Kontrak Id] = b.[Kontrak Id]
    JOIN [MARKETING].dbo.Kol c WITH(NOLOCK) on b.[Kol Id] = c.[Kol Id] 
    JOIN [MARKETING].dbo.[Kol Kontrak Status] d WITH(NOLOCK) on d.[Kontrak Id] = a.[Kontrak Id] 
    JOIN [MARKETING].dbo.Brief e WITH(NOLOCK) on a.[Brief Id] = e.[Brief Id] 
    JOIN [MARKETING].dbo.[Brief Status] f WITH(NOLOCK) ON e.[Brief Id] = f.[Brief Id]
    JOIN [MARKETING].dbo.[Kol Manager] g ON a.[Manager Id] = g.[Manager Id] 
    WHERE a.[Post Id] = @postId`,
GET_CONTRACT_DETAIL_QUERY: `select * from [MARKETING].[dbo].[Kol Kontrak] where [Kontrak Id] = @contractId`
}

module.exports =  {QUERIES}