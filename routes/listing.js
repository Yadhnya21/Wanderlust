const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require('../middleware.js');
const { isOwner } = require('../middleware.js');
const { validateListing } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const uploadCloud = multer({ storage: storage });
const listingController = require('../controllers/listing');

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, uploadCloud.single('image'), validateListing, wrapAsync(listingController.createListing));

    // New Route to Render New Form
router.get('/new', isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, 
        uploadCloud.single("image"), validateListing, isOwner, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


// Edit Route to Render Edit Form
router.get('/:id/edit', isLoggedIn, isOwner,wrapAsync (listingController.renderEditForm));

module.exports = router;