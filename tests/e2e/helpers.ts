import { request, expect } from '@playwright/test';

export async function resetAndSeed(baseURL: string) {
    const ctx = await request.newContext({ baseURL });
    await ctx.post('/__test__/reset');
    const res = await ctx.post('/__test__/seed');
    expect(res.status()).toBe(201);
    const data = await res.json();
    await ctx.dispose();
    return data;
}