const express = require('express');
const app = express();
require('dotenv').config();

const AWS = require('aws-sdk');

function generateRandomCode(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/', (req, res) => {

    console.log("Message = " + req.query.message);
    console.log("Number = " + req.query.number);
    console.log("Subject = " + req.query.subject);
    const params = {
        Message: `Your verification code is: ${generateRandomCode(1000, 9999)}`,
        PhoneNumber: '+' + req.query.number,
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': req.query.subject
            }
        }
    };

    console.log(params)

    const publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

    publishTextPromise.then(
        function (data) {
            res.end(JSON.stringify(data));
        }).catch(
        function (err) {
            res.end(JSON.stringify({ Error: err }));
        });

});

app.listen(3000, () => console.log('SMS Service Listening on PORT 3000'))