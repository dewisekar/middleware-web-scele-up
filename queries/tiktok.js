const TIKTOK_QUERIES = {
  INSERT_KOL_LISTING: `INSERT INTO MARKETING.dbo.[kol-tiktok-listing]
    (username, followers, totalViews, costPerSlot, avgCpm, avgViews, minViews, maxViews, minCpm, maxCpm, createdAt)
    VALUES(@username, @followers, @totalViews, @costPerSlot, @avgCpm, @avgViews, @minViews, @maxViews, @minCpm, @maxCpm, GETDATE());`,
  FETCH_KOL_LISTING: `SELECT id, username, followers, totalViews, costPerSlot, round(avgCpm, 2) as avgCpm, round(avgViews, 2) as avgViews, 
    minViews, maxViews, round(minCpm, 2) as minCpm, round(maxCpm, 2) as maxCpm, createdAt
    FROM MARKETING.dbo.[kol-tiktok-listing] order by createdAt desc;`
};

module.exports = { TIKTOK_QUERIES };
