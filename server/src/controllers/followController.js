let follows = [];

exports.followSociety = (req, res) => {
  const userId = "mock-user-001";
  const societyId = req.params.id;

  const already = follows.find(
    f => f.user === userId && f.society === societyId
  );

  if (already) {
    return res.json({
      success: true,
      message: "Already following"
    });
  }

  follows.push({
    user: userId,
    society: societyId
  });

  res.json({
    success: true,
    message: "Now following"
  });
};

exports.unfollowSociety = (req, res) => {
  const userId = "mock-user-001";
  const societyId = req.params.id;

  follows = follows.filter(
    f => !(f.user === userId && f.society === societyId)
  );

  res.json({
    success: true,
    message: "Unfollowed"
  });
};

exports.getFollowedSocieties = (req, res) => {
  const userId = "mock-user-001";

  const userFollows = follows.filter(
    f => f.user === userId
  );

  res.json({
    success: true,
    data: userFollows
  });
};

module.exports.follows = follows;

exports.checkFollowStatus = (req, res) => {
  const userId = "mock-user-001";
  const societyId = req.params.id;

  const isFollowing = follows.some(
    f => f.user === userId && f.society === societyId
  );

  res.json({
    success: true,
    following: isFollowing
  });
};