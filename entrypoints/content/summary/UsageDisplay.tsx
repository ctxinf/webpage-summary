import type { ModelConfigItem } from '@/constants/model-settings';

interface UsageDisplayProps {
  messages: any[];
  currentModel?: ModelConfigItem;
}

export function UsageDisplay({ messages, currentModel }: UsageDisplayProps) {
  let totalInput = 0;
  let totalOutput = 0;
  let totalCached = 0;

  for (const m of messages) {
    if (m.role === 'assistant') {
      const usage = (m.metadata as any)?.usage;
      if (usage) {
        totalInput += usage.inputTokens ?? usage.promptTokens ?? 0;
        totalOutput += usage.outputTokens ?? usage.completionTokens ?? 0;
        totalCached += usage.cachedInputTokens ?? usage.promptTokensDetails?.cachedTokens ?? usage.cachedTokens ?? 0;
      }
    }
  }

  if (totalInput === 0 && totalOutput === 0) return null;

  const rawInput = totalInput - totalCached;

  const priceUnit = currentModel?.priceUnit || '$';

  const rawInputCost = currentModel ? (rawInput * currentModel.inputTokenPrice) / 1_000_000 : 0;
  const cachedCost = currentModel ? (totalCached * (currentModel.inputTokenPrice / 10)) / 1_000_000 : 0;
  const outputCost = currentModel ? (totalOutput * currentModel.outputTokenPrice) / 1_000_000 : 0;

  const totalCost = rawInputCost + cachedCost + outputCost;

  const formatCost = (cost: number) => {
    if (!cost) return '0';
    if (cost < 0.000001) return '<0.000001';
    return parseFloat(cost.toFixed(6)).toString();
  };

  const hoverText =
    `↑in: ${rawInput} ${priceUnit}${formatCost(rawInputCost)}` +
    (totalCached > 0 ? ` (cached: ${totalCached} ${priceUnit}${formatCost(cachedCost)})` : '') +
    `    ↓out: ${totalOutput} ${priceUnit}${formatCost(outputCost)}`;

  return (
    <div title={hoverText} className="px-1.5 py-0.5 bg-zinc-300/80 backdrop-blur-md rounded-md text-[10px] text-zinc-600 font-mono tracking-tight flex items-center gap-1.5 leading-tight">
      <span>↑{totalInput}</span>
      <span>↓{totalOutput}</span>
      {totalCost > 0 && <span>{priceUnit}{formatCost(totalCost)}</span>}
    </div>
  );
}
