export function resolveDeadlock(strategy = "cancel-order") {
  const resolutions = {
    "cancel-order": "Cancelled Order B and released Mixer.",
    "preempt-resource": "Preempted Mixer from Order B and assigned it to Order A.",
    "release-resources": "Released all held resources and restarted allocation in a fixed order.",
    "reorder-allocation": "Enforced Oven -> Mixer global resource ordering."
  };
  return { strategy, resolved: true, message: resolutions[strategy] || resolutions["cancel-order"] };
}
