const { SendEmailCommand, SESClient } = require("@aws-sdk/client-ses");
const accessKey = "AKIAZG67FIMGHCL3XQN2";
const secret = "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";
const region = "us-east-1";
const AWS_SES = new SESClient({
  credentials: { accessKeyId: accessKey, secretAccessKey: secret },
  region: region,
});

const subscribedUsers = [
  {
    id: 1,
    email: "vrajat269@gmail.com",
  },
];

const userMessageMap = new Map();
const createSendEmailCommand = (toAddress, message) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: message,
        },
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "EMAIL_SUBJECT",
      },
    },
    Source: "vrajat269@gmail.com",
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const sendEmail = async (to, message, messageId) => {
  const sendEmailCommand = createSendEmailCommand(to, message);

  try {
    const res = await AWS_SES.send(sendEmailCommand);
    console.log("email send successfully");
  } catch (e) {
    console.error("Failed to send email.");
    return e;
  }
};

const sendEmailIfNotSent = async (email, message, id) => {
  try {
    if (!hasUserRecievedMessage(email, id)) {
      await sendEmail(email, message);
      recordUserWithMessageId(email, id);
    } else {
      console.log("message already sent");
    }
  } catch (error) {
    console.error(`Error sending email to ${email}`, error);
  }
};

const hasUserRecievedMessage = (email, id) => {
  const messageMap = userMessageMap.get(email) || [];
  console.log();
  if (messageMap.indexOf(id) !== -1) {
    return true;
  }
  return false;
};

const recordUserWithMessageId = (email, id) => {
  const messageMap = userMessageMap.get(email) || [];
  messageMap.push(id);
  userMessageMap.set(email, messageMap);
};

const sendMailToSubscribedUsers = async (message, messageId) => {
  try {
    await Promise.all(
      subscribedUsers.map((user) =>
        sendEmailIfNotSent(user.email, message, messageId)
      )
    );
  } catch (error) {
    console.error("Failed to send email to subscribed user.", error);
  }
};

module.exports = {
  sendEmail,
  sendMailToSubscribedUsers,
};
