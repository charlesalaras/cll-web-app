// Interface for props sent to any question
export interface QuestionProps {
    identifier: string,
    uuid: string,
    callback: Function,
}
// Fetcher function for useSWR hook
export const fetcher =  async (url: string) => fetch(url).then((res) => res.json());
// Interface for replacing dynamic question parameters
interface QuestionParams {
    [key: string]: string,
}
// Function to replace all body parameters with respective values
export const replaceParams = (body: string, params: QuestionParams) => {
    if(params === undefined) return body;
    var p = body;
    const regex = /\{{(.*?)\}}/gm;
    const matches = p.matchAll(regex);
    Array.from(matches).forEach((match) => {
        p = p.replace(match[0], params[match[1]]);
    });
    return p;
};
// Function to send a record of an attempt
export const sendAttempt = (
    uuid: string,
    iso8601: string,
    duration: number,
    score: number,
    correct: boolean,
    id: string,
    attempt: number,
    answer: {[key: string]: string},
    variant: string,
    ) => {
    fetch('/api/sendAttempt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "uuid": uuid,
            "iso8601": iso8601,
            "duration": duration,
            "score": score,
            "correct": correct,
            "id": id,
            "variant": variant,
            "attempt": attempt,
            "answer": answer,
        }),
    });
};
// Function to send a record of current question state
export const sendState = (
    uuid: string,
    id: string, 
    variant: string = "", 
    attempts: number,
    correct: boolean,
    ) => {
    fetch('/api/saveProgress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "uuid": uuid,
            "qid": id,
            "attempts": attempts,
            "correct": correct,
            "variant": variant,
        }),
    });
};
