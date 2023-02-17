import moment from "moment";

export class AIBotService {

    private week = ["Monday", "Tuesday", "wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    private compareStrings: any = {
        "hi": "Hi, Dasha!",
        "hello": "Hello, Dasha!",
        "date": `Today is ${moment(new Date()).format("DD.MM.YYYY")}`,
        "day": `Today is ${this.week[moment(new Date()).day() - 1]}`,
        "weather": "The average monthly air temperature is -1.2 – +3.4°C."
    };

    public getAnswer(question: string) {

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