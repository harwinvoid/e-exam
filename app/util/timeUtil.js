var moment = require('moment');
exports.format = function (value) {
  var completeDate = value.startTime.split('T')[0],
    date = completeDate.substr(0, 10),
    begin = value.startTime.split('T')[1].substr(0, 5),
    end = value.endTime.split('T')[1].substr(0, 5),
    formatStartDateStr = completeDate + ' ' + begin,
    formatEndDateStr = completeDate + ' ' + end;
  return {
    startTime: formatStartDateStr,
    endTime: formatStartDateStr

  };
}
/**
 * 考试资源是否可用（监考老师，考场）
 *@ params date1 已经分配监考的时间数组
 * @ params date2 将要分配的考试时间
 */
exports.isAvaiable = function (TeacherAllExam, date2) {
  var flag = true;
  console.log("data",TeacherAllExam);
  for (var i = 0, len = TeacherAllExam.length; i < len; i++) {
    if (moment(date2.startTime).isAfter(TeacherAllExam[i].time.startTime) && moment(date2.startTime).isBefore(TeacherAllExam[i].time.endTime)) {
      flag = false;
      break;
    }
  }
  return flag;

}
