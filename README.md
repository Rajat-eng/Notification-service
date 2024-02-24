for backend --> cd backend /. -> npm start
for frontend==> cd frontend /. npm run dev

There are already pushed messages in sqs

Flow
 1) cron jobs fetches messages from sqs which has message id and message body
 2) messgae is sent to subscibed users(already stored) in node js
 3) to ensure message is not duplicated to subscribed user , map function is impllemneted to check if user has message with messgae id
 4) messaage is sent using aws SES.
