const TIKTOK_QUERIES = {
  INSERT_KOL_LISTING: `INSERT INTO MARKETING.dbo.[kol-tiktok-listing]
    (username, followers, totalViews, costPerSlot, avgCpm, avgViews, minViews, maxViews, minCpm, maxCpm, createdAt, status)
    VALUES(@username, @followers, @totalViews, @costPerSlot, @avgCpm, @avgViews, @minViews, @maxViews, @minCpm, @maxCpm, GETDATE(), @status);`,
  FETCH_KOL_LISTING: `SELECT id, username, followers, totalViews, costPerSlot, round(avgCpm, 2) as avgCpm, round(avgViews, 2) as avgViews, 
    minViews, maxViews, round(minCpm, 2) as minCpm, round(maxCpm, 2) as maxCpm, createdAt, status, updatedAt
    FROM MARKETING.dbo.[kol-tiktok-listing] order by createdAt desc;`,
  APPROVE_LISTING: `UPDATE MARKETING.dbo.[kol-tiktok-listing]
    SET status=@status, updatedAt=GETDATE() where id = @id;`
};

module.exports = { TIKTOK_QUERIES };
