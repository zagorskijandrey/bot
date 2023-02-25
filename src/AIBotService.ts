import moment from "moment";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import {useState} from "react";
import {sign} from "crypto";
import {RequestOptions} from "https";


export class AIBotService {

    private week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // private signs: any = [
    //     {name: "aquarius",start: {month: 1, day: 20}, end: {month: 2, day: 18}},
    //     {name: "pisces",start: {month: 2, day: 19}, end: {month: 3, day: 20}},
    //     {name: "aries", start: {month: 3, day: 21}, end: {month: 4, day: 19}},
    //     {name: "taurus", start: {month: 4, day: 20}, end: {month: 5, day: 20}},
    //     {name: "gemini", start: {month: 5, day: 21}, end: {month: 6, day: 20}},
    //     {name: "cancer", start: {month: 6, day: 21}, end: {month: 7, day: 22}},
    //     {name: "leo", start: {month: 7, day: 23}, end: {month: 8, day: 22}},
    //     {name: "virgo", start: {month: 8, day: 23}, end: {month: 9, day: 22}},
    //     {name: "libra", start: {month: 9, day: 23}, end: {month: 10, day: 22}},
    //     {name: "scorpio", start: {month: 10, day: 23}, end: {month: 11, day: 21}},
    //     {name: "sagittarius", start: {month: 11, day: 22}, end: {month: 12, day: 21}},
    //     {name: "capricorn", start: {month: 12, day: 22}, end: {month: 1, day: 19}}
    // ];

    private signs = ["aquarius", "pisces", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn"];


    private compareStrings: any = {
        "hi": "Hi,",
        "hello": "It's nice to meet you,",
        "date": `Today is ${moment(new Date()).format("DD.MM.YYYY")}`,
        "day": `Today is ${this.week[moment(new Date()).day() - 1]}`,
        "horoscope": `Can you share your birthdate with me, please?`,
        "thanks": "You're welcome!"
    };

    async getAnswer(question: string) {

        const arr = question.trim().replaceAll(',', ' ')
            .replaceAll('.', '').replaceAll('!', '')
            .replaceAll('?', '').split(" ");

        let answer = "";

        return new Promise((resolve) => {
            if (this.signs.find(item => item === question)) {
                // @ts-ignore
                this.fetchHoroscope(question).then((res: any) => {
                    return resolve(res)
                }).catch(error => {
                    return resolve("Horoscope API Server error :( Sorry!")
                })
            } else {
                arr.forEach(item => {
                    if (!answer && this.compareStrings[item.toLowerCase()]) answer = this.compareStrings[item.toLowerCase()];
                });
                return resolve(answer || "I can't answer on your question :( Sorry!")
            }
        })
    };

    public fetchHoroscope(sign: string) {
        const requestOptions: any  = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        return fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, requestOptions)
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

    public getZodiacSign = (value: string) => {
        try {
            const birthDate = new Date(value);
            const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
            // const signs = ["aquarius", "pisces", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn"];
            let month = birthDate.getMonth();
            let day = birthDate.getDate();
            if(month == 0 && day <= 20){
                month = 11;
            }else if(day < days[month]){
                month--;
            }
            return this.signs[month];
        } catch (e) {
            return "Incorrect input date"
        }
    };
}
