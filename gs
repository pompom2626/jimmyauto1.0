function doGet(e) {
  Logger.log(JSON.stringify(e));
  var htmlOutput  = HtmlService.createTemplateFromFile('page.html');
  
  const sheetId  = "1k6sOkJAWB1IpP4TQ5lANKyleeGiMQuv5VuBFmEKs2-A";
  const sheetName = "calender 연동";
  const sheet     = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);

  if ( !e.parameter['username'] || !e.parameter['input_date'] ||!e.parameter['input_time']||!e.parameter['input_endtime'] || !e.parameter['phone'] || !e.parameter['email'] ) {
    htmlOutput.message = '입력한 값이 없습니다.';
  } else {
    htmlOutput.message = `${e.parameter['username']} 님 ${e.parameter['input_date']} 일 ${e.parameter['input_time']} 에 예약이 접수되었습니다.`;
    // Google Sheets에 이력 등록
    sheet.getRange(sheet.getLastRow()+1, 1, 1, 5).setValues([[e.parameter['username'], e.parameter['phone'], e.parameter['email'], e.parameter['input_date'], e.parameter['input_time']]])
                                                 .setBorder(true, true, true, true, true, true);
    // Google Calendar에 일정 등록
    setCalendar(e.parameter['username'], e.parameter['input_date'], e.parameter['input_time'], e.parameter['input_endtime'] );
    // 완료메일 전송
    sendEmail(e.parameter['username'], e.parameter['email'], e.parameter['input_date'], e.parameter['input_time']);
  }

  htmlOutput.url = getUrl();
  return htmlOutput.evaluate();
}

function getUrl() {
  const url = ScriptApp.getService().getUrl();
  return url;
}

/**
 * Google Calendar Event 등록
 * @param {string} name = 이름
 * @param {string} date = 날짜
 * @param {string} time = 시간
 */
function setCalendar(name, date, time, endtime) {
 /**  CalendarApp.createAllDayEvent(`${name}님 예약`, new Date(date)); 
CalendarApp.createAllDayEvent(`${name}님 예약 ${time}`, new Date(date));
const Mdate = Utilities.formatDate(date, "GMT-0800", 'MMMM dd, yyyy 12:00:00 Z')
const mdate =  parseInt(date);
const mtime = parseInt(time);
const mendtime = parseInt(endtime);*/
CalendarApp.createEvent(`${name}님 예약 ${time}`, new Date(`${date}" "${time}`),new Date(`${date}" "${endtime}`));
}
/**
 * Send Email.
 * 이메일을 이용한 Notify.
 * @param {string} name       = 받는사람 이름
 * @param {string} recipient  = 받는사람 이메
 * @param {string} date       = 예약일
 * @param {string} time = 시간
 */
function sendEmail(name, recipient, date, time) {
  try {
    const subject = `${name}님 ${date} 예약 완료 메일`;
    
    let html = `<h1>${name} 님.</h1>`;
        html += `<div>${date} 일 ${time} 시간의 예약이 정상적으로 처리되었습니다.</div>`;
        html += `<div>이용해주셔서 감사합니다.</div>`;

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      htmlBody: html
    });

    return {"result": "200", "message" : "Success!"};

   } catch (error) {
      Logger.log(error.message);
      return {"result": "999", "message" : error.message};
  }
}
