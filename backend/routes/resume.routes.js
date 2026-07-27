import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadPic, uploadDoc } from "../middlewares/uploadImage.middleware.js";
import {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
    uploadProfileImage,
    uploadExistingResume
} from "../controllers/resume.controller.js";

const router = Router();

// Apply JWT verification middleware to all resume routes
router.use(verifyJWT);

router.post("/upload-image", uploadPic.single("image"), uploadProfileImage);
router.post("/upload-existing", uploadDoc.single("resumeFile"), uploadExistingResume);

router.route("/")
    .post(createResume)
    .get(getUserResumes);

router.route("/:id")
    .get(getResumeById)
    .put(updateResume)
    .delete(deleteResume);

export default router;
