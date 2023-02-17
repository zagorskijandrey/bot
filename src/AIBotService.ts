import moment from "moment";
import {RequestOptions} from "https";

export class AIBotService {

    private week = ["Monday", "Tuesday", "wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    private cities: any = {
        "kyiv": {lat: 51, lng: 34},
        "london": {lat: 0, lng: 0}
    };

    private compareStrings: any = {
        "hi": "Hi,",
        "hello": "Hello,",
        "date": `Today is ${moment(new Date()).format("DD.MM.YYYY")}`,
        "day": `Today is ${this.week[moment(new Date()).day() - 1]}`,
        "weather": "The average monthly air temperature is -1.2 – +3.4°C.",
        "price car": "This car costs 15 000$",
        "car price": "This car costs 15 000$"
    };

    public getAnswer(question: string) {

        const arr = question.trim().replaceAll(',', ' ')
            .replaceAll('.', '').replaceAll('!', '')
            .replaceAll('?', '').split(" ");

        let answer = "";

        if (this.cities[question.toLowerCase()]) {
            this.fetchWeaterAPI(this.cities[question.toLowerCase()].lat, this.cities[question.toLowerCase()].lng).then((res: any) => {
                answer = `Temperature ${res.current.temp}`;
            }).catch(error => {})
        } else {
            arr.forEach(item => {
                if (!answer && this.compareStrings[item.toLowerCase()]) answer = this.compareStrings[item.toLowerCase()];
            });
        }
        return answer || "I can't answer on your question :( Sorry!";
    };

    public fetchWeaterAPI(lat: number, lng: number) {
        return fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=bf64caf37de45d7b2e9751adc28f384a`)
            .then(async (response: any) => {
                if (response.status === 204 || response.status === 201) {
                    return {};
                } else if (response.status < 200 || response.status >= 300) {
                    if (response.status === 401)
                        return Promise.reject(await response.json());
                }
                return await response.json();
            }).then((json: any) => {
            return new Promise((resolve, reject) => {
                resolve(json);
            });
        });
    }
}