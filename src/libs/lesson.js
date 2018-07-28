let Lesson = require(`./models/Lesson`);
let mongoose = require(`mongoose`);

exports.create = async(lesson) => {
    return new Promise(async(resolve, reject) => {
        try {
            let newLesson = new Lesson({
                siteLessonID: lesson.lessonID
            });
        
            let savedLesson = await newLesson.save();
            resolve(savedLesson);
        } catch (err){
            reject(err);
        }
    });
};

exports.findBySiteID = async(SiteID) => {
    return new Promise(async(resolve, reject) => {
        try {
            let lesson = await Lesson.findBySiteID(SiteID);

            resolve(lesson);
        } catch (err){
            reject(err);
        }
    });
};

exports.doesUserExist = async(siteID, userID) => {
    return new Promise(async(resolve, reject) => {
        try {
            let lesson = await Lesson.doesUserExist(siteID, userID);

            resolve(lesson);
        } catch (err){
            reject(err);
        }
    });
};

exports.addUser = async(siteID, userID) => {
    return new Promise(async(resolve, reject) => {
        try {
            await Lesson.addUser(siteID, {
                id: mongoose.Types.ObjectId(userID)
            });
            resolve();
        } catch (err){
            reject(err);
        }
    });
};