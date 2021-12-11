const mailer = require("../utils/mailer");

const sendMail = async (clientEmail, subject, content) => {
  try {
    // Thực hiện gửi email
    await mailer.sendMail(clientEmail, subject, content);
    return "Đăng ký tài khoản thành công, vui lòng check mail để xem chi tiết!";
  } catch (error) {
    // Nếu có lỗi thì log ra để kiểm tra và cũng gửi về client
    console.log(error);
    return error;
  }
};

module.exports = {
  sendMail: sendMail,
};
