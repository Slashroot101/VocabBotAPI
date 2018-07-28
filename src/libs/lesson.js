let Lesson = require(`./models/Lesson`);

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