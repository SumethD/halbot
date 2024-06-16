This document contains instructions for building and deploying the Halbot backend and frontend.

Pre-req:
* Fork this repository to your GitHub account.

Frontend:
The frontend is deployed to AWS Amplify automatically on each push.
Some may not prefer this, as such these instructions focus on
how to build the React app into static files for the browser:

1. Run npm run build in the root folder.
2. A /dist folder will be created in the root containing the HTML, JS, & CSS for the frontend.
3. Configure your webserver to serve this /dist folder.

Backend:
The backend is an AWS Lambda Function written in Typescript.
Instructions:
1. Create an AWS Lambda Function with a Node v20 runtime.
2. Copy the contents of server.ts into the code section
3. Setup a trigger with API Gateway (POST request).

Additional info:
* Follow the backend steps to deploy the lambda handler.