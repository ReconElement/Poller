import * as z from 'zod';
export type WSData = {
    data: {
        A: string,
        B: string,
        E: number,
        T: number,
        a: string,
        b: string,
        e: string,
        s: string,
        u: number
    },
    stream: string
};

const zodDataObject = z.object({
    A: z.string(),
    B: z.string(),
    E: z.number(),
    T: z.number(),
    a: z.string(),
    b: z.string(),
    e: z.string(),
    s: z.string(),
    u: z.number(),
})
export const zodWSData = z.object({
    data: zodDataObject,
    stream: z.string()
});

export type SentObject = {
    price_updates: [{
        asset: "BTC",
        price: number,
        decimal: number
    },{
        asset: "ETH",
        price: number,
        decimal: number
    },{
        asset: "SOL",
        price: number,
        decimal: number
    }]
};