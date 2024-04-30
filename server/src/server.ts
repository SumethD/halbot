import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";


const sendMessageToLex = async (inputText) => {
    const client = new LexRuntimeV2Client({ region: "ap-southeast-2" });

    const params = {
        botId: '0G6W842ZWL',
        localeId: 'en_US',
        sessionId: 'ablkhas-aslkhda',
        botAliasId: 'TSTALIASID',
        botName: 'Hal_R_2',
        text: inputText,
        userId: 'user123'
    };

    try {
        const postText = new RecognizeTextCommand(params)
        const data = await client.send(postText);

        return { success: true, messages: data.message, fullResponse: data };
    } catch (error) {
        console.error('Error communicating with Amazon Lex:', error);
        return { success: false, message: 'Error communicating with Amazon Lex' };
    }
};


export const handler = async (event) => {

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };
    // TODO implement
    const response = {
        statusCode: '200',
        body: JSON.stringify('Hello from Lambda!'),
    };

    if(event.httpMethod !== 'POST') {
        console.log("Event method NOT HTTP, throwing error")
        body = {
            code: 400,
            msg: `Unsupported HTTP Method: ${event.httpMethod}`,
        }
        return {
            statusCode: '400',
            body: JSON.stringify(body),
            headers
        }
    }

    const {message} = JSON.parse(event.body);
    const res = await sendMessageToLex(message);
    console.log('data retrievied', JSON.stringify(res, null, 2));

    return {
        statusCode,
        headers,
        body: JSON.stringify(res)
    };
};
