const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { promoCodes } = require("../data/seed");

const router = express.Router();

router.post("/validate", (req, res) => {
  const code = String((req.body && req.body.code) || "").trim();
  if (!code) {
    return res.status(400).json({ message: "Promo code is required" });
  }

  const matching = promoCodes.find(
    (promo) => promo.code.toLowerCase() === code.toLowerCase(),
  );
  if (
    matching &&
    (!matching.is_active ||
      new Date(matching.expires_at).getTime() <= Date.now())
  ) {
    return res.status(400).json({ message: "Promo code is expired" });
  }

  // BUG-003: any non-empty non-expired code returns success with a 10% discount,
  // including codes that do not exist.
  return res.status(200).json({
    id: matching ? matching.id : uuidv4(),
    code,
    discount_percent: 10,
    expires_at: matching
      ? matching.expires_at
      : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    is_active: true,
  });
});

module.exports = router;
