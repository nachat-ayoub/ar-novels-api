const router = require("express").Router();
const NovelRoutes = require("./NovelRoutes");

router.get("/", async (req, res, next) => {
  res.send({ message: "Ok api is working 🚀" });
});

router.use("/novels", NovelRoutes);

module.exports = router;
