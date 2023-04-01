const DASHBOARD_QUERIES = {
  GET_TOTAL_VIEWS_BY_YEAR_AND_MANAGER: `SELECT SUM(a.views) as totalViews, MONTH(b.[Tgl Post Real]) as month FROM MARKETING.dbo.Post_View a
    JOIN MARKETING.dbo.Post b on b.[Post Id] = a.postId 
    WHERE a.dayNumber = 7 AND YEAR(b.[Tgl Post Real]) = @year AND (@managerId is null or b.[Manager Id] = @managerId)
    GROUP BY MONTH(b.[Tgl Post Real])
    `
};

module.exports = { DASHBOARD_QUERIES };
