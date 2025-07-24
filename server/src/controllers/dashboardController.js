import { homeDataService } from "#services";

const dashboardController = {
  async getHomeData(req, res, next) {
    try {
      const { userId } = req.user;
      const homeData = await homeDataService.getHomeData(userId);

      res
        .status(200)
        .json({ data: homeData, message: "Home data retrieved successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default dashboardController;
