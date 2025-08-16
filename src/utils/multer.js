const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDirectory = "uploads/";
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

function createDirectoryIfNotExists(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

const ProjectStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const imageDirectory = "uploads/project";
        createDirectoryIfNotExists(imageDirectory);
        cb(null, imageDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, "project_"  + Date.now() + path.extname(file.originalname));
    }
});

const TaskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const imageDirectory = "uploads/task";
        createDirectoryIfNotExists(imageDirectory);
        cb(null, imageDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, "task_"  + Date.now() + path.extname(file.originalname));
    }
});



const ProjectImg = multer({
    storage: ProjectStorage,
    // limits: {
    //     fileSize: 1024 * 1024, 
    // },
});


const TaskImg = multer({ storage: TaskStorage, });

module.exports = { ProjectImg, TaskImg };
