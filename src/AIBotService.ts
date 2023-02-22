import moment from "moment";


export class AIBotService {

    private week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    private cities: any = {
        "kyiv": {lat: 50.4333, lng: 30.5167},
        "london": {lat: 51.5085, lng: -0.1257},
        "rome": {lat: 41.8947, lng: 12.4839},
        "amsterdam": {lat: 52.374, lng: 4.8897},
        "warsaw": {lat: 52.2298, lng: 21.0118},
        "kharkiv": {lat: 50, lng: 36.25},
        "ottawa": {lat: 45.4112, lng: -75.6981}
    };

    private compareStrings: any = {
        "hi": "Hi,",
        "hello": "It's nice to meet you,",
        "date": `Today is ${moment(new Date()).format("DD.MM.YYYY")}`,
        "day": `Today is ${this.week[moment(new Date()).day() - 1]}`,
        "weather": "First of all tell me where do you live?",
        "thanks": "You're welcome!"
    };

    async getAnswer(question: string) {

        const arr = question.trim().replaceAll(',', ' ')
            .replaceAll('.', '').replaceAll('!', '')
            .replaceAll('?', '').split(" ");

        let answer = "";

        return new Promise((resolve) => {
            if (this.cities[question.toLowerCase()]) {
                this.fetchWeaterAPI(this.cities[question.toLowerCase()].lat, this.cities[question.toLowerCase()].lng).then((res: any) => {
                    return resolve(res);
                }).catch(error => {
                    return resolve("Weather API Server error :( Sorry!");
                })
            } else {
                arr.forEach(item => {
                    if (!answer && this.compareStrings[item.toLowerCase()]) answer = this.compareStrings[item.toLowerCase()];
                });
                return resolve(answer || "I can't answer on your question :( Sorry!");
            }
        })
    };

    public fetchWeaterAPI(lat: number, lng: number) {
        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=bf64caf37de45d7b2e9751adc28f384a`)
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