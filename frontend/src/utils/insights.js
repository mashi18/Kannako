export function generateTips(stats, transactions = []) {
  const tips = [];
  if (!stats) return tips;

  const { today, week, month } = stats;

  if (today && today.totalIn > 0 && today.totalIn > (week?.totalIn || 0) / 7 * 1.5) {
    tips.push({ emoji: '📈', text: 'Sales are booming today! Keep up the great work.' });
  }

  if (today && today.totalIn === 0 && today.count === 0) {
    tips.push({ emoji: '🔔', text: 'No sales recorded yet today. Make the first entry!' });
  }

  if (month && month.totalIn > 0 && month.totalOut > 0) {
    const ratio = month.totalIn / month.totalOut;
    if (ratio < 1.1) {
      tips.push({ emoji: '⚠️', text: 'Expenses are nearly matching income. Try to reduce costs.' });
    } else if (ratio > 2) {
      tips.push({ emoji: '💰', text: 'Great profit margin this month! Consider saving for slow days.' });
    }
  }

  if (stats.totalReceivable > stats.totalPayable * 2 && stats.totalReceivable > 10000) {
    tips.push({ emoji: '📋', text: `Customers owe you ₹${stats.totalReceivable.toLocaleString()}. Follow up on pending payments.` });
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (transactions && transactions.length > 5) {
    const dayTotals = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const day = d.getDay();
      if (t.type === 'IN') {
        dayTotals[day] = (dayTotals[day] || 0) + t.amount;
      }
    });
    const maxDay = Object.entries(dayTotals).sort((a, b) => b[1] - a[1])[0];
    if (maxDay && maxDay[1] > 0) {
      tips.push({ emoji: '📊', text: `Your best sales day is ${dayNames[Number(maxDay[0])]}! Average: ₹${Math.round(maxDay[1]).toLocaleString()}` });
    }
  }

  if (stats.customerCount === 0) {
    tips.push({ emoji: '👥', text: 'Start adding customers to your Khata to track udhaar!' });
  }

  return tips;
}
