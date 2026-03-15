const express = require("express");
const router = express.Router();

const {
  getForYouController,
  getBecauseYouViewedController,
  getUsersAlsoViewedController,
  getFrequentlyBoughtTogetherController,
  getPersonalizedTrendingController,
  getReEngageController,
  getSmartSuggestionsController,
  getPopularController,
  getRecentController,
} = require("../controllers/discovery.controller");

const {
  authMiddleware,
  optionalAuth,
} = require("../middlewares/auth.middleware");

/**
 * ===============================================================
 * SMART DISCOVERY ROUTES
 * ===============================================================
 *
 * Route Overview:
 *
 *  GET /discovery/for-you           → Personalised feed (main feed)
 *  GET /discovery/trending          → Trending in your categories
 *  GET /discovery/re-engage         → Viewed but not yet purchased
 *  GET /discovery/suggestions       → Smart autocomplete
 *
 *  GET /discovery/because-you-viewed/:productId   → Similar to a viewed product
 *  GET /discovery/users-also-viewed/:productId    → Collaborative filtering
 *  GET /discovery/frequently-bought/:productId    → Co-purchase patterns
 *
 *  GET /discovery/popular           → All-time bestsellers
 *  GET /discovery/recent            → Newest arrivals
 *
 * Auth strategy:
 *   - optionalAuth  → Works for guests, improves for logged-in users
 *   - authMiddleware → Requires login (personalised-only routes)
 * ===============================================================
 */

/**
 * 🎯 For You — Master personalised feed
 * Degrades gracefully for guests (shows popular products)
 */
router.get("/for-you", optionalAuth, getForYouController);

/**
 * 🔥 Trending — Global or personalised based on auth state
 */
router.get("/trending", optionalAuth, getPersonalizedTrendingController);

/**
 * ⏮ Re-Engage — "Pick up where you left off"
 * Requires login — shows viewed but not purchased products
 */
router.get("/re-engage", authMiddleware, getReEngageController);

/**
 * 🔍 Smart Suggestions — Autocomplete boosted by user interests
 * Degrades gracefully for guests
 */
router.get("/suggestions", optionalAuth, getSmartSuggestionsController);

/**
 * 👁 Because You Viewed — Products similar to a specific viewed product
 */
router.get(
  "/because-you-viewed/:productId",
  optionalAuth,
  getBecauseYouViewedController,
);

/**
 * 👥 Users Also Viewed — Collaborative filtering
 * "Users who viewed this also viewed..."
 */
router.get("/users-also-viewed/:productId", getUsersAlsoViewedController);

/**
 * 🛒 Frequently Bought Together — Co-purchase patterns
 */
router.get(
  "/frequently-bought/:productId",
  getFrequentlyBoughtTogetherController,
);

/**
 * 🏆 Popular — All-time bestsellers (unchanged, used as fallback)
 */
router.get("/popular", getPopularController);

/**
 * 🆕 Recent — Newest arrivals
 */
router.get("/recent", getRecentController);

module.exports = router;
