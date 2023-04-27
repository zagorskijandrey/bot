import { NdArray } from "numjs";
import * as ndarray from "ndarray";
import ECG  from './ECG.json';

export class ECGService {

    public static ready_1(tu: number): { t: number[]; data: any; ph_tu_1: any, phase_1_ecg_1: any; phase_2_ecg_1: any } {
        const iSampleRate = 500;
        const f_data: any = [];

        // fetch('./ECG.txt')
        //     .then(r => r.text())
        //     .then(text => {
        //         console.log('text decoded:', text);
        //     });

        // @ts-ignore
        const lines = ECG.text.split('\n');
        lines.forEach(line => {
            line.trim();
            f_data.push(line.split(' ').map((x) => parseFloat(x)).filter((x) => !isNaN(x)));
        });


        // const file = new QFile('ecg1.txt');
        // if (file.open(QIODevice.ReadOnly | QIODevice.Text)) {
        //     const lineStreamReader = new QTextStream(file);
        //     while (!lineStreamReader.atEnd()) {
        //         const line = lineStreamReader.readLine();
        //         f_data.push(line.split(' ').map((x) => parseFloat(x)));
        //     }
        //     file.close();
        // }
        //
        const data = f_data.flat();
        const iSampleCount = data.length;
        const t = Array.from({ length: iSampleCount }, (_, i) => i * (iSampleCount / iSampleRate));
        // console.log(t)
        const phase_1_ecg_1 = data.slice(0, data.length - tu);
        const phase_2_ecg_1 = data.slice(tu);
        // console.log(phase_1_ecg_1)
        // console.log(phase_2_ecg_1)
        const ph_tu_1 = this.gradient(data, t);
        return {t, data, ph_tu_1, phase_1_ecg_1, phase_2_ecg_1};
    }

    static gradient(arr1: number [], arr2: number []) {
        const numElements = arr1.length;
        const result = new Array(numElements);

        for (let i = 0; i < numElements; i++) {
            // вычисляем производную
            if (i === 0) {
                result[i] = (arr1[i+1] - arr1[i]) / (arr2[i+1] - arr2[i]);
            } else if (i === numElements - 1) {
                result[i] = (arr1[i] - arr1[i-1]) / (arr2[i] - arr2[i-1]);
            } else {
                result[i] = (arr1[i+1] - arr1[i-1]) / (arr2[i+1] - arr2[i-1]);
            }
        }

        return result;
    }

    public static ecgCustomDataset(Fh: number, A_T: number, mu_T: number, bT1: number, bT2: number, negativeT: boolean) {
        const params = {
            A_P: 0.1,
            A_Q: -0.1,
            A_R: 1,
            A_S: -0.3,
            A_T,
            mu_P: 0.4,
            mu_Q: 0.46,
            mu_R: 0.5,
            mu_S: 0.54,
            mu_T,
            sigma_P: 0.02,
            sigma_Q: 0.01,
            sigma_R: 0.01,
            sigma_S: 0.01,
            sigma_T_1: bT1,
            sigma_T_2: bT2,
            T: 60 / Fh,
            Fs: 256
        };

        const timeline = this.getTimeline(params.T, params.Fs);
        const slicedIndex = timeline.indexOf(this.getSlicedIndex(params.mu_T, timeline));
        const ecg = new Array(timeline.length).fill(0).map((_, i) => {
            return this.gaussian(timeline[i], params.A_P, params.mu_P, params.sigma_P) +
                this.gaussian(timeline[i], params.A_Q, params.mu_Q, params.sigma_Q) +
                this.gaussian(timeline[i], params.A_R, params.mu_R, params.sigma_R) +
                this.gaussian(timeline[i], params.A_S, params.mu_S, params.sigma_S) +
                (
                    negativeT ?
                        (i <= slicedIndex ?
                            this.gaussian(timeline[i], -params.A_T, params.mu_T, params.sigma_T_1)
                            :
                            this.gaussian(timeline[i], -params.A_T, params.mu_T, params.sigma_T_2))
                        :
                        (i <= slicedIndex ?
                            this.gaussian(timeline[i], params.A_T, params.mu_T, params.sigma_T_1)
                            :
                            this.gaussian(timeline[i], params.A_T, params.mu_T, params.sigma_T_2))
                )

        });
        return {timeLine: timeline.map(item => Number(item.toFixed(2))), ecg};
    }

    public static ecgDataset(negativeT: boolean, asymmetryT: boolean) {
        const params = {
            A_P: 0.1,
            A_Q: -0.1,
            A_R: 1,
            A_S: -0.3,
            A_T: 0.2,
            mu_P: 0.4,
            mu_Q: 0.46,
            mu_R: 0.5,
            mu_S: 0.54,
            mu_T: 0.7,
            sigma_P: 0.02,
            sigma_Q: 0.01,
            sigma_R: 0.01,
            sigma_S: 0.01,
            sigma_T_1: asymmetryT ? 0.03 : 0.05,
            sigma_T_2: 0.05,
            T: 1,
            Fs: 256
        };

        const timeline = this.getTimeline(params.T, params.Fs);
        const slicedIndex = timeline.indexOf(this.getSlicedIndex(params.mu_T, timeline));
        const ecg = new Array(timeline.length).fill(0).map((_, i) => {
            return this.gaussian(timeline[i], params.A_P, params.mu_P, params.sigma_P) +
                this.gaussian(timeline[i], params.A_Q, params.mu_Q, params.sigma_Q) +
                this.gaussian(timeline[i], params.A_R, params.mu_R, params.sigma_R) +
                this.gaussian(timeline[i], params.A_S, params.mu_S, params.sigma_S) +
                (
                    negativeT ?
                        (i <= slicedIndex ?
                            this.gaussian(timeline[i], -params.A_T, params.mu_T, params.sigma_T_1)
                            :
                            this.gaussian(timeline[i], -params.A_T, params.mu_T, params.sigma_T_2))
                        :
                        (i <= slicedIndex ?
                            this.gaussian(timeline[i], params.A_T, params.mu_T, params.sigma_T_1)
                            :
                            this.gaussian(timeline[i], params.A_T, params.mu_T, params.sigma_T_2))
                )

        });
        return {timeLine: timeline.map(item => Number(item.toFixed(2))), ecg};
    }

    public static ecgCycle(Fh: number, A_T: number, mu_T: number, sigma_T_1: number, sigma_T_2: number, alt: number,
                           countCycles: number, noise: number) {
        const params = {
            A_P: 0.1,
            A_Q: -0.1,
            A_R: 1,
            A_S: -0.3,
            A_T,
            mu_P: 0.4,
            mu_Q: 0.46,
            mu_R: 0.5,
            mu_S: 0.54,
            mu_T: 0.7,
            sigma_P: 0.02,
            sigma_Q: 0.01,
            sigma_R: 0.01,
            sigma_S: 0.01,
            sigma_T_1,
            sigma_T_2,
            alt,
            T: 1, // 60 /** 1000*/ / Fh, //1,
            Fs: 256,
            correlation: 1,// 60 / Fh,
            countCycles,
            noise
        };

        // T = 60 * 1000 / self.Fh
        // fs = 256
        // correlation = 60 / self.Fh
        // time = np.arange(0, T / 1000, 1 / (fs * T))
        // time_ = list(time)
        // a = [0.1, -0.1, 1, -0.3]
        // m = [0.4, 0.46, 0.5, 0.54]
        // b = [0.02, 0.01, 0.01, 0.01

        const timeline = this.getTimeline(params.T, params.Fs);

        // const time: number[] = Array.from(
        //     { length: Math.floor(params.T / 1000 * params.Fs) },
        //     (_, i) => i / (params.Fs * 1000)
        // );
        // const time_: number[] = [...time];

        if (params.sigma_T_1 > params.mu_Q + 3 * params.sigma_Q) {
            params.sigma_T_1 = params.mu_Q + 3 * params.sigma_Q;
        }
        if (params.sigma_T_2 > params.T - params.mu_T) {
            params.sigma_T_2 = params.T - params.mu_T;
        }

        const slicedIndex = timeline.indexOf(this.getSlicedIndex(params.mu_T, timeline));

        const sign = new Array(timeline.length).fill(0).map((_, i) => {
            return this.gaussianCorrelation(timeline[i], params.A_P, params.mu_P, params.sigma_P, params.correlation) +
                this.gaussianCorrelation(timeline[i], params.A_Q, params.mu_Q, params.sigma_Q, params.correlation) +
                this.gaussianCorrelation(timeline[i], params.A_R, params.mu_R, params.sigma_R, params.correlation) +
                this.gaussianCorrelation(timeline[i], params.A_S, params.mu_S, params.sigma_S, params.correlation) +
                (
                    i <= slicedIndex ?
                        this.gaussianCorrelation(timeline[i], params.A_T + params.alt, params.mu_T, params.sigma_T_1, params.correlation)
                        :
                        this.gaussianCorrelation(timeline[i], params.A_T + params.alt, params.mu_T, params.sigma_T_2, params.correlation)
                )

        });


        const signal_ecg = new Array(timeline.length).fill(0).map((_, i) => {
            return this.gaussianCorrelation(timeline[i], params.A_P, params.mu_P, params.sigma_P, params.correlation) +
                this.gaussianCorrelation(timeline[i], params.A_Q, params.mu_Q, params.sigma_Q, params.correlation) +
                this.gaussianCorrelation(timeline[i], params.A_R, params.mu_R, params.sigma_R, params.correlation) +
                this.gaussianCorrelation(timeline[i], params.A_S, params.mu_S, params.sigma_S, params.correlation) +
                (
                    i <= slicedIndex ?
                        this.gaussianCorrelation(timeline[i], params.A_T, params.mu_T, params.sigma_T_1, params.correlation)
                        :
                        this.gaussianCorrelation(timeline[i], params.A_T, params.mu_T, params.sigma_T_2, params.correlation)
                )

        });

        // const prevT1 = timeline.slice(0, slicedIndex).map(t =>
        //     Math.exp(-((t - params.mu_T * params.correlation) ** 2) / (2 * (params.sigma_T_1 * params.correlation) ** 2)));
        //
        // const prevT2 = timeline.slice(slicedIndex).map(t =>
        //     Math.exp(-((t - params.mu_T * params.correlation) ** 2) / (2 * (params.sigma_T_2 * params.correlation) ** 2)));
        //
        const time_l = [/*...timeline*/];// Array.from({ length: params.countCycles }, (_, i) => i / params.Fs/* * params.T)*/);
        for(let i = 0; i < params.countCycles; i++) {
            time_l.push(...timeline.map(item => i + item))
        }
        // console.log(time_l)
        // const signT1_ = prevT1.map(p => p * (params.A_T + params.alt));
        // const signT2_ = prevT2.map(p => p * (params.A_T + params.alt));
        //
        // const signT_ = [...signT1_, ...signT2_];
        // const signal = [...sign, ...signT_];
        // console.log(signal)
        // let result = [...signal_ecg, ...signal];

        // const signT_ = [...signT1_, ...signT2_];
        // let result = [...ecg, ...signT_];
        // let result = [...signal_ecg, ...signal];
        // for (let i = 0; i < params.countCycles - 2; i++) {
        //     result = i % 2 === 0 ? [...result, ...signal_ecg] : [...result, ...signal];
        // }
        let result: any [] = [/*...signal_ecg, ...signal*/];
        for (let i = 0; i < params.countCycles; i++) {
            i % 2 === 0 ? result.push(...signal_ecg) : result.push(...sign);
            // result.push(...signal_ecg)
            //i % 2 === 0 ? result.push(...signal_ecg) : result.push(...signal);// [...result, ...signal_ecg] : [...result, ...signal];
        }
        // const x_watts = result.map(r => r ** 2);
        // const mean_noise = 0;
        // const noise_value = params.noise;
        // const noise_volts = Array.from({ length: x_watts.length }, () =>
        //     Math.random() * noise_value + mean_noise
        // );
        // const ecg = result.map((r, i) => r + noise_volts[i]);

        console.log(result)

        return {timeLine: time_l, ecg: result};
    }

    static getTimeline(T: number, Fs: number): number [] {
        return Array.from({length: Math.floor(T * Fs)}, (_, i) => i / Fs);
    }

    static getSlicedIndex(x: number, times: number[]): number {
        for (let i = 0; i < times.length; i++) {
            if (times[i] > x) {
                x = times[i];
                break;
            }
        }
        return x;
    }

    static gaussian(t: number, A: number, mu: number, sigma: number): number {
        return A * Math.exp(-(Math.pow((t - mu), 2)) / (2 * Math.pow(sigma, 2)));
    }

    static gaussianCorrelation(t: number, A: number, mu: number, sigma: number, correlation: number): number {
        return A * Math.exp(-(Math.pow((t - mu * correlation), 2)) / (2 * Math.pow(sigma * correlation, 2)));
    }
}
