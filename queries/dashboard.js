const DASHBOARD_QUERIES = {
  GET_TOTAL_VIEWS_BY_YEAR_AND_MANAGER: `SELECT SUM(a.views) as totalViews, MONTH(b.[Tgl Post Real]) as month FROM MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post b on b.[Post Id] = a.postId 
    WHERE a.dayNumber = 7 AND YEAR(b.[Tgl Post Real]) = @year AND (@managerId is null or b.[Manager Id] = @managerId)
    GROUP BY MONTH(b.[Tgl Post Real])
    `,
  GET_FOLLOWED_UP_POSTS: `SELECT 
  a.[Tgl Post Sesuai Jadwal] as deadlinePost, 
  a.[Post Id] as postId,
  a.[Kontrak Id] as contractId, 
  c.[Name] + ' (' + CONVERT(VARCHAR,d.[Kontrak Ke]) + ')' as contractName,
  f.[Brief Code] +' | '+ e.[Tema] as briefName,
  g.[Manager Name] as pic,
  c.Username as username,
  c.Platform as platform,
  CASE WHEN [Tgl Post Sesuai Jadwal] = CAST(GETDATE() AS DATE) THEN 'Hari Ini' ELSE 'Terlambat' END as status
  FROM [MARKETING].dbo.Post a
  JOIN [MARKETING].dbo.[Kol Kontrak] b WITH(NOLOCK) on a.[Kontrak Id] = b.[Kontrak Id]
  JOIN [MARKETING].dbo.Kol c WITH(NOLOCK) on b.[Kol Id] = c.[Kol Id] 
  JOIN [MARKETING].dbo.[Kol Kontrak Status] d WITH(NOLOCK) on d.[Kontrak Id] = a.[Kontrak Id] 
  JOIN [MARKETING].dbo.Brief e WITH(NOLOCK) on a.[Brief Id] = e.[Brief Id] 
  JOIN [MARKETING].dbo.[Brief Status] f WITH(NOLOCK) ON e.[Brief Id] = f.[Brief Id]
  JOIN MARKETING.dbo.[Kol Manager] g on g.[Manager Id] = a.[Manager Id] 
  WHERE [Tgl Post Sesuai Jadwal] = CAST(GETDATE() AS DATE) OR [Tgl Post Sesuai Jadwal] < CAST(GETDATE() AS DATE) AND [Tgl Post Real] IS NULL
  AND (@managerId is null or b.[Manager Id] = @managerId)`
};

module.exports = { DASHBOARD_QUERIES };
