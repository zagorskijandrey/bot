export class ECGService {

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

    static getTimeline(T : number, Fs: number): number [] {
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
}
