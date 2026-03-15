export const calculateEMI = (principal, annualInterestRate, tenureMonths) => {
  if (!principal || !annualInterestRate || !tenureMonths) return 0;
  const monthlyRate = annualInterestRate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
};

export const generateAmortizationSchedule = (principal, annualInterestRate, tenureMonths, emi, extraPayment = 0) => {
  let balance = principal;
  const monthlyRate = annualInterestRate / 12 / 100;
  const schedule = [];
  let actualMonths = 0;
  let totalInterestPaid = 0;

  while (balance > 0 && actualMonths < tenureMonths * 2) { // Safeguard loop
    actualMonths++;
    const interestPayment = balance * monthlyRate;
    let principalPayment = emi - interestPayment + extraPayment;

    // Final month adjustment
    if (balance - principalPayment < 0) {
      principalPayment = balance;
    }

    balance -= principalPayment;
    totalInterestPaid += interestPayment;

    schedule.push({
      month: actualMonths,
      emi: Math.round(emi + (actualMonths === 1 ? 0 : 0)), // Standard EMI display
      totalPayment: Math.round(principalPayment + interestPayment), // Includes extra payment
      principalPayment: Math.round(principalPayment),
      interestPayment: Math.round(interestPayment),
      remainingBalance: Math.max(0, Math.round(balance)),
    });
  }

  return { schedule, actualMonths, totalInterestPaid: Math.round(totalInterestPaid) };
};