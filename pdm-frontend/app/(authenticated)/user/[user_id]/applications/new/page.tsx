"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { UserDashboardLayout } from "@/layouts/UserDashboardLayout";
import { ArrowLeft, ArrowRight, Check, DollarSign, FileText } from "lucide-react";

interface Product {
  id: number;
  name: string;
  minAmount: number;
  maxAmount: number;
  minTermMonths: number;
  maxTermMonths: number;
  interestRate: number;
}

interface FormData {
  productId: string;
  requestedAmount: string;
  requestedTermMonths: string;
  purpose: string;
}

export default function NewApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    productId: '',
    requestedAmount: '',
    requestedTermMonths: '12',
    purpose: '',
  });

  const selectedProduct = products.find(p => p.id === parseInt(formData.productId));

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated, isLoading, router]);

  const loadProducts = async () => {
    try {
      const data = await apiClient.get('/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Mock products for testing
      setProducts([
        { id: 1, name: 'Personal Loan', minAmount: 1000, maxAmount: 50000, minTermMonths: 6, maxTermMonths: 60, interestRate: 8.5 },
        { id: 2, name: 'Home Improvement', minAmount: 5000, maxAmount: 100000, minTermMonths: 12, maxTermMonths: 120, interestRate: 7.5 },
        { id: 3, name: 'Education Loan', minAmount: 2000, maxAmount: 75000, minTermMonths: 12, maxTermMonths: 84, interestRate: 6.5 },
      ]);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.productId && !!formData.requestedAmount && parseFloat(formData.requestedAmount) > 0;
      case 2:
        return !!formData.purpose && formData.purpose.length >= 10;
      case 3:
        return validateStep(1) && validateStep(2);
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setSubmitting(true);
    try {
      const application = await apiClient.post('/applications', {
        productId: parseInt(formData.productId),
        requestedAmount: parseFloat(formData.requestedAmount),
        requestedTermMonths: parseInt(formData.requestedTermMonths),
        purpose: formData.purpose,
      }) as any;

      router.push(`/user/${user?.id}/applications/${application.id}`);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate EMI
  const calculateEMI = () => {
    if (!selectedProduct || !formData.requestedAmount) return null;
    const principal = parseFloat(formData.requestedAmount);
    const rate = selectedProduct.interestRate / 100 / 12;
    const term = parseInt(formData.requestedTermMonths);
    const emi = (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    return {
      emi: emi.toFixed(2),
      totalPayment: (emi * term).toFixed(2),
      totalInterest: ((emi * term) - principal).toFixed(2),
    };
  };

  const emiData = calculateEMI();

  const steps = [
    { number: 1, title: "Loan Details", icon: DollarSign },
    { number: 2, title: "Purpose", icon: FileText },
    { number: 3, title: "Review", icon: Check },
  ];

  return (
    <UserDashboardLayout>
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => router.push(`/user/${user?.id}/applications`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#374151',
              cursor: 'pointer',
              marginBottom: '16px',
            }}
          >
            <ArrowLeft size={18} />
            Back to Applications
          </button>

          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0, marginBottom: '8px' }}>
            New Loan Application
          </h1>
          <p style={{ fontSize: '15px', color: '#6b7280', margin: 0 }}>
            Complete the application in 3 simple steps
          </p>
        </div>

        {/* Progress Stepper */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          {steps.map((step, index) => (
            <div key={step.number} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: currentStep >= step.number ? '#3b82f6' : '#e5e7eb',
                    color: currentStep >= step.number ? 'white' : '#9ca3af',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  {currentStep > step.number ? <Check size={20} /> : step.number}
                </div>
                <span
                  style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    fontWeight: currentStep === step.number ? '600' : '400',
                    color: currentStep >= step.number ? '#111827' : '#9ca3af',
                  }}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  style={{
                    width: '80px',
                    height: '2px',
                    backgroundColor: currentStep > step.number ? '#3b82f6' : '#e5e7eb',
                    margin: '0 16px',
                    marginBottom: '28px',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* Step Content */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '24px',
            }}
          >
            {/* Step 1: Loan Details */}
            {currentStep === 1 && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0, marginBottom: '24px' }}>
                  Select Loan Product & Amount
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Product Selection */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Loan Product *
                    </label>
                    <select
                      value={formData.productId}
                      onChange={(e) => updateField('productId', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                      }}
                    >
                      <option value="">Select a product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.interestRate}% APR
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Requested Amount *
                    </label>
                    <input
                      type="number"
                      value={formData.requestedAmount}
                      onChange={(e) => updateField('requestedAmount', e.target.value)}
                      placeholder="Enter amount"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    />
                    {selectedProduct && (
                      <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                        Range: ${selectedProduct.minAmount.toLocaleString()} - ${selectedProduct.maxAmount.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Term */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Loan Term (months)
                    </label>
                    <select
                      value={formData.requestedTermMonths}
                      onChange={(e) => updateField('requestedTermMonths', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: 'white',
                      }}
                    >
                      {[6, 12, 18, 24, 36, 48, 60].map(term => (
                        <option key={term} value={term}>{term} months</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* EMI Preview */}
                {emiData && (
                  <div
                    style={{
                      marginTop: '24px',
                      padding: '16px',
                      backgroundColor: '#f0f9ff',
                      borderRadius: '8px',
                      border: '1px solid #bae6fd',
                    }}
                  >
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0369a1', margin: 0, marginBottom: '12px' }}>
                      Estimated Monthly Payment
                    </h3>
                    <p style={{ fontSize: '28px', fontWeight: '700', color: '#0c4a6e', margin: 0 }}>
                      ${emiData.emi}
                    </p>
                    <p style={{ fontSize: '12px', color: '#0369a1', margin: 0, marginTop: '8px' }}>
                      Total: ${emiData.totalPayment} (Interest: ${emiData.totalInterest})
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Step 2: Purpose */}
            {currentStep === 2 && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0, marginBottom: '24px' }}>
                  Loan Purpose
                </h2>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Purpose of Loan *
                  </label>
                  <textarea
                    value={formData.purpose}
                    onChange={(e) => updateField('purpose', e.target.value)}
                    placeholder="Please describe why you need this loan (minimum 10 characters)"
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {formData.purpose.length}/10 characters minimum
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0, marginBottom: '24px' }}>
                  Review Your Application
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#6b7280' }}>Product</span>
                    <span style={{ fontWeight: '500', color: '#111827' }}>{selectedProduct?.name || '-'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#6b7280' }}>Amount</span>
                    <span style={{ fontWeight: '500', color: '#111827' }}>${parseFloat(formData.requestedAmount || '0').toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#6b7280' }}>Term</span>
                    <span style={{ fontWeight: '500', color: '#111827' }}>{formData.requestedTermMonths} months</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ color: '#6b7280' }}>Interest Rate</span>
                    <span style={{ fontWeight: '500', color: '#111827' }}>{selectedProduct?.interestRate || '-'}% APR</span>
                  </div>
                  <div style={{ padding: '12px 0' }}>
                    <span style={{ color: '#6b7280', display: 'block', marginBottom: '8px' }}>Purpose</span>
                    <span style={{ fontWeight: '500', color: '#111827' }}>{formData.purpose}</span>
                  </div>
                </div>

                {emiData && (
                  <div
                    style={{
                      marginTop: '24px',
                      padding: '16px',
                      backgroundColor: '#f0fdf4',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0',
                    }}
                  >
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#166534', margin: 0, marginBottom: '8px' }}>
                      Monthly Payment
                    </h3>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#14532d', margin: 0 }}>
                      ${emiData.emi}/month
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Navigation Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: currentStep === 1 ? 'flex-end' : 'space-between',
                gap: '12px',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb',
              }}
            >
              {currentStep > 1 && (
                <button
                  onClick={previousStep}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: validateStep(currentStep) ? '#3b82f6' : '#9ca3af',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    cursor: validateStep(currentStep) ? 'pointer' : 'not-allowed',
                  }}
                >
                  Next Step
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !validateStep(3)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: submitting || !validateStep(3) ? '#9ca3af' : '#22c55e',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    cursor: submitting || !validateStep(3) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                  <Check size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
