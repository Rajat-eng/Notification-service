const AWS_SQS_URL = "https://sqs.us-east-1.amazonaws.com/633438814988/test";
const {
  SendMessageCommand,
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageBatchCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");

const { sendEmail, sendMailToSubscribedUsers } = require("./ses");

const accessKey = "AKIAZG67FIMGHCL3XQN2";
const secret = "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";
const region = "us-east-1";
const AWS_SQS = new SQSClient({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secret,
  },
  region: region,
});

const pushSQS = async (sqsQueueUrl = AWS_SQS_URL, mail) => {
  const command = new SendMessageCommand({
    QueueUrl: sqsQueueUrl,
    DelaySeconds: 10,

    MessageBody: mail,
  });
  try {
    const res = await AWS_SQS.send(command);
    console.log("message sent", res);
  } catch (e) {
    console.error("Failed to send email.");
    return e;
  }
};

const receiveMessage = (queueUrl) =>
  AWS_SQS.send(
    new ReceiveMessageCommand({
      AttributeNames: ["SentTimestamp"],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ["All"],
      QueueUrl: queueUrl,
      WaitTimeSeconds: 10,
      VisibilityTimeout: 30,
    })
  );

const getFromSQS = async (queueUrl = AWS_SQS_URL) => {
  try {
    const { Messages } = await receiveMessage(queueUrl);

    if (!Messages) {
      return;
    }

    console.log(Messages.length);

    if (Messages.length === 1) {
      await Promise.all(
        Messages.map((message) => {
          sendMailToSubscribedUsers(
            message.Body,
            message.MessageAttributes.Id.StringValue
          );
        })
      );
      // await AWS_SQS.send(
      //   new DeleteMessageCommand({
      //     QueueUrl: queueUrl,
      //     ReceiptHandle: Messages[0].ReceiptHandle,
      //   })
      // );
    } else {
      console.log("msg from queue >-1", Messages.length);
      // update email logs
      await Promise.all(
        Messages.map((message) => {
          sendMailToSubscribedUsers(
            message.Body,
            message.MessageAttributes.Id.StringValue
          );
        })
      );
      // await AWS_SQS.send(
      //   new DeleteMessageBatchCommand({
      //     QueueUrl: queueUrl,
      //     Entries: Messages.map((message) => ({
      //       Id: message.MessageId,
      //       ReceiptHandle: message.ReceiptHandle,
      //     })),
      //   })
      // );
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  pushSQS,
  getFromSQS,
};
