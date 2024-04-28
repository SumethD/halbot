const AWS = import('aws-sdk');

AWS.config.update({
  region: 'ap-southeast-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const lexruntime = new AWS.LexRuntime();

export const sendMessageToLex = async (inputText) => {
  const params = {
    botAlias: 'TestBotAlias',
    botName: 'HAL_R_2',
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
