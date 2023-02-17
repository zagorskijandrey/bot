export class AIBotService {

    private static compareStrings: any = {
        "hi": "Hi!",
        "hello": "Hello!",
        "date": `Today is ${new Date()}`
    };

    public static getAnswer(question: string) {

        const arr = question.trim().replaceAll(',', ' ')
            .replaceAll('.', '').replaceAll('!', '')
            .replaceAll('?', '').split(" ");
        let answer = "";
        arr.forEach(item => {
            if (!answer && this.compareStrings[item.toLowerCase()]) answer = this.compareStrings[item.toLowerCase()]
        });
        return answer || "I can't answer on your question :( Sorry!";
    };
}