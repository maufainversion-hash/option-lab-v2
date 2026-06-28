// Validación del motor TS contra Hull. Correr: npx tsx scripts/validate.ts
import {
  bsPrice, bsPriceBoth, allGreeks, crrPrice, leisenReimerPrice,
  mcPriceEuropean, impliedVol, parityCheck, longCall, payoffAtExpiry, linspace,
} from "../src/lib/quant/index";

let pass = 0;
let fail = 0;
function check(name: string, got: number, want: number, tol: number) {
  const ok = Math.abs(got - want) <= tol;
  console.log(`${ok ? "✓" : "✗"} ${name}: got ${got.toFixed(6)} want ${want} (±${tol})`);
  ok ? pass++ : fail++;
}

// Hull Ej. 14.6: S=42, K=40, T=0.5, r=.10, σ=.20
const { call, put } = bsPriceBoth(42, 40, 0.5, 0.1, 0.2, 0);
check("BS call (Hull 14.6)", call, 4.7594, 5e-4);
check("BS put  (Hull 14.6)", put, 0.8086, 5e-4);

// Binomial converge a BS
check("CRR n=500 call", crrPrice(42, 40, 0.5, 0.1, 0.2, 0, 500, "call"), 4.7594, 1e-2);
check("LR n=51 call", leisenReimerPrice(42, 40, 0.5, 0.1, 0.2, 0, 51, "call"), 4.7594, 5e-3);

// Greeks de referencia (Hull): delta call ~0.779
const g = allGreeks(42, 40, 0.5, 0.1, 0.2, 0, "call");
check("delta call", g.delta, 0.7791, 5e-3);
console.log(`  gamma=${g.gamma.toFixed(4)} vega=${g.vega.toFixed(4)} theta/yr=${g.theta.toFixed(4)} rho=${g.rho.toFixed(4)}`);

// Monte Carlo cerca de BS
const mc = mcPriceEuropean(42, 40, 0.5, 0.1, 0.2, 0, "call", 200000, true, 7);
check("MC call ~BS", mc.price, 4.7594, 0.05);

// Parity (precios BS consistentes deben cumplir parity exactamente)
const pc = parityCheck(call, put, 42, 40, 0.5, 0.1, 0, 1e-6);
check("parity difference≈0", pc.difference, 0, 1e-6);

// Payoff long call: a S=K paga -premium; muy ITM paga (S-K-premium)
const lc = longCall(40, 0.5, 4.7594);
const pl = payoffAtExpiry(lc, [40, 60]);
check("payoff long call @40", pl[0], -4.7594, 1e-3);
check("payoff long call @60", pl[1], 60 - 40 - 4.7594, 1e-3);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
