"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { apiClient } from "@/lib/api";
import type { Loan, Transaction } from "@/lib/types";

export default function LoanDetailPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const loanId = Number(params.id);

  const [loan, setLoan] = useState<Loan | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!user) {
      return;
    }

    const fetchData = async () => {
      try {
        const [loanData, transactionsData] = await Promise.all([
          apiClient.getLoan(loanId),
          apiClient.get(`/transactions?loanId=${loanId}`),
        ]);

        setLoan(loanData as Loan);
        setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      } catch (error) {
        console.error("Error fetching loan details:", error);
        alert("Failed to load loan details");
        router.push("/loans");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthenticated, isLoading, router, loanId]);

  const calculatePaymentSchedule = () => {
    if (!loan || !loan.startDate) return [];

    const schedule = [];
    const startDate = new Date(loan.startDate);

    for (let i = 0; i < loan.termMonths; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + i + 1);

      const paymentNumber = i + 1;
      const scheduledAmount = loan.monthlyPayment;

      // Find actual payment for this period
      const actualPayment = transactions
        .filter(t => t.type === "LOAN_PAYMENT")
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        [i];

      schedule.push({
        paymentNumber,
        dueDate: paymentDate,
        scheduledAmount,
        actualAmount: actualPayment ? Math.abs(actualPayment.amount) : null,
        paidDate: actualPayment ? new Date(actualPayment.createdAt) : null,
        status: actualPayment ? "PAID" : paymentDate < new Date() ? "OVERDUE" : "PENDING",
      });
    }

    return schedule;
  };

  const handleMakePayment = async () => {
    if (!loan) return;

    const paymentAmount = loan.monthlyPayment;
    const confirm = window.confirm(
      `Make a payment of $${paymentAmount.toLocaleString()} for this loan?`
    );

    if (!confirm) return;

    try {
      const updatedLoan = await apiClient.post(`/loans/${loanId}/payment`, { amount: paymentAmount });
      setLoan(updatedLoan as Loan);

      // Refresh transactions
      const updatedTransactions = await apiClient.get(`/transactions?loanId=${loanId}`);
      setTransactions(Array.isArray(updatedTransactions) ? updatedTransactions : []);

      alert("Payment successful!");
    } catch (error) {
      console.error("Error making payment:", error);
      alert("Failed to make payment");
    }
  };

  if (isLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!loan) {
    return (
      <Layout>
        <Card>
          <p className="text-center text-gray-500 py-8">Loan not found</p>
        </Card>
      </Layout>
    );
  }

  const paymentSchedule = calculatePaymentSchedule();
  const paidPayments = paymentSchedule.filter(p => p.status === "PAID").length;
  const overduePayments = paymentSchedule.filter(p => p.status === "OVERDUE").length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => router.push("/loans")}
              className="text-blue-600 hover:text-blue-800 mb-2"
            >
              ← Back to Loans
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Loan #{loan.id}</h1>
            <p className="text-gray-500">{loan.purpose}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            loan.status === "ACTIVE" ? "bg-green-100 text-green-800" :
            loan.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
            loan.status === "PAID_OFF" ? "bg-blue-100 text-blue-800" :
            "bg-red-100 text-red-800"
          }`}>
            {loan.status}
          </span>
        </div>

        {/* Loan Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500">Loan Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">${(loan.amount || 0).toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500">Interest Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{loan.interestRate}%</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500">Monthly Payment</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">${(loan.monthlyPayment || 0).toLocaleString()}</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-500">Term</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{loan.termMonths} months</p>
            </div>
          </Card>
        </div>

        {/* Progress */}
        <Card title="Loan Progress">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Amount Paid</span>
              <span className="text-sm font-medium text-gray-900">
                ${(loan.amountPaid || 0).toLocaleString()} / ${(loan.totalPayable || 0).toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${((loan.amountPaid || 0) / (loan.totalPayable || 1)) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining Balance</span>
              <span className="font-semibold text-gray-900">${(loan.remainingBalance || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payments Made</span>
              <span className="font-semibold text-gray-900">{paidPayments} / {loan.termMonths}</span>
            </div>
            {overduePayments > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">
                  ⚠️ You have {overduePayments} overdue payment{overduePayments > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Schedule */}
        <Card title="Payment Schedule">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paymentSchedule.map((payment) => (
                  <tr key={payment.paymentNumber} className={payment.status === "OVERDUE" ? "bg-red-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paymentNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.dueDate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${payment.scheduledAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.actualAmount ? `$${payment.actualAmount.toLocaleString()}` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paidDate ? payment.paidDate.toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        payment.status === "PAID" ? "bg-green-100 text-green-800" :
                        payment.status === "OVERDUE" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Actions */}
        {loan.status === "ACTIVE" && loan.remainingBalance > 0 && (
          <Card>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ready to make a payment?</h3>
                <p className="text-sm text-gray-600">Your next payment of ${loan.monthlyPayment.toLocaleString()} is due soon</p>
              </div>
              <button
                onClick={handleMakePayment}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium"
              >
                Make Payment (${loan.monthlyPayment.toLocaleString()})
              </button>
            </div>
          </Card>
        )}

        {/* Transaction History */}
        <Card title="Transaction History">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded-md"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.type}</p>
                    <p className="text-xs text-gray-500">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      (transaction.amount || 0) >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {(transaction.amount || 0) >= 0 ? "+" : ""}${Math.abs(transaction.amount || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.referenceNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
