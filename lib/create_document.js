var AWS = require('aws-sdk');
AWS.config.region = process.env.AWS_REGION;
var lambda = new AWS.Lambda();

module.exports = function insert (record, callback) {
  var params = {
    FunctionName: 'lambda-taggable-createdocument-v2', // lambda function to invoke
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify(record)
  };

  lambda.invoke(params, function(err, data) {
    if (err) {
      console.log(' - - - - - - - - - - - - CloudSearch ERROR:', err);
      err._id = record._id;
    } else {
      data._id = record._id;
    }
    console.log(err, data);
    callback(err, data);
  });
};
