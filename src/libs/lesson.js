let Lesson = require(`./models/Lesson`);

exports.create = async(lesson) => {
    return new Promise(async(resolve, reject) => {
        let newLesson = new Lesson({
            siteLessonID: lesson.lessonID
        });
    
        let savedLesson = await newLesson.save();
        resolve(savedLesson);
    });
};