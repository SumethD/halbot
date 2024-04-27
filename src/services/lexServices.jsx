const AWS = require('aws-sdk');

AWS.config.update({
  region: 'YOUR_REGION',
  accessKeyId: 'YOUR_ACCESS_KEY_ID',
  secretAccessKey: 'YOUR_SECRET_ACCESS_KEY'
});

const lexruntime = new AWS.LexRuntime();

export const sendMessageToLex = async (inputText) => {
  const params = {
    botAlias: 'YOUR_BOT_ALIAS',
    botName: 'YOUR_BOT_NAME',
    inputText,
    userId: 'user123'
  };

  try {
    const data = await lexruntime.postText(params).promise();
    return { success: true, message: data.message };
  } catch (error) {
    console.error('Error communicating with Amazon Lex:', error);
    return { success: false, message: 'Error communicating with Amazon Lex' };
  }
};
