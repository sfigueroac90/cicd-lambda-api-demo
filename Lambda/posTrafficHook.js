const  AWS = require("aws-sdk");
const codeDeploy = new AWS.CodeDeploy({apiVersion: "2014-10-06"});
const lambda = new AWS.Lambda();

exports.hanlder = (event,context,callback) => {
     console.log("Entering Pretraffic Hook!");

     const deploymentId = event.deploymentId;
     const lifeCycleEventHookExecutionId = event.lifeCycleEventHookExecutionId;
     const functionToTest = process.env.NewVersion;

     console.log(`Testin new fucntion version ${functionToTest}`);

     const lambdaParams = {
         FuntionName: functionToTest,
         InvocationTye: "RequestResponse"
     }

     lambda.invoke(lambdaParams, (error, data) =>{
         console.log(`Lambda Data ${JSON.stringify(data)}`);
         const response = JSON.parse(data.Payload);

         if (response.body == "Hello World!"){
             status = "Succeeded"
         }

         const params = {
             deploymentId,
             lifeCycleEventHookExecutionId,
             status
         }

         return codeDeploy.putLifecycleEventHookExecutionStatus(params).promise()
         .then(data => callback(null,"Validation succeeded"))
         .catch(err => callback( `Validation test failed ${err}`));
     });
}