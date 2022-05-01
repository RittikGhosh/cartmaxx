const nodeMailer = require("nodemailer");


//here sendEmail fn will send email to user who is trying to reset his password and we are using nodemailer package for that
//options is the obj that we had send as arguement
const sendEmail = async (options) => {
    //transpoter means from whose account you will send the mail ,you can check the docs os nodemailer for for info
    const transporter = nodeMailer.createTransport({
        host:"smtp.gmail.com",
        port: 465,
        service: 'gmail',
        auth: {
            user: "rittickghosh8670@gmail.com",
            pass: "867056203322*#*#",
        },
    });



    //details of the mail u will send
    const mailOptions = {
        from: "rittickghosh8670@gmail.com",
        to: options.email,
        subject: options.subject,   //subject in the mail
        text: options.message,  //what we will send in email
    };

    //sending the mail
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;  //exporting it to usercontroller so that forgotpassword controller can use this fn
