import { Request } from 'express';

const analyzeSingle = async (req: Request, text: string) => {
    console.log(text);
    const response = await req.languageClient.analyzeEntities({
        document: {
            content: text,
            type: 'PLAIN_TEXT'
        }
    });
    return response;
};

export const languageService = {
    analyzeSingle
};
