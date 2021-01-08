import { Request } from 'express';
import { Person } from '../../models/Great-Thing';

const analyzeSingle = async (req: Request, text: string): Promise<{people: Person[], modifiedText: string}> => {
    const response = await req.languageClient.analyzeEntities({
        document: {
            content: text,
            type: 'PLAIN_TEXT'
        }
    });
    const people = response[0].entities
        .filter((entity) => entity.type === 'PERSON')
        .map((person) => ({
            name: person.name,
            type: <string>person.type,
            referencesInText: person.mentions?.map((mention) => mention.text.content)
        }));
    const modifiedText = modifyText(text, people);
    console.log(modifiedText);
    return { people, modifiedText };
};

function modifyText(originalText: string, people: Person[]): string {
    let modifiedString = originalText;
    people.forEach((person) => {
        const stringParts = [modifiedString];
        person.referencesInText.forEach((ref) => {
            const remainingString = stringParts.pop();
            const before = remainingString.substring(0, remainingString.indexOf(ref));
            const after = remainingString.substring(remainingString.indexOf(ref) + ref.length);
            stringParts.push(
                before,
                `{{${ref}}}`,
                after
            );
        });
        modifiedString = stringParts.join('');
    });
    return modifiedString;
}

export const languageService = {
    analyzeSingle
};
