'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { vehicleApi } from '@/lib/api';
import { useApplicationStore } from '@/store/application';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  imageUrl: string;
  dealerId: string;
  dealerName: string;
  color: string;
  mileage: number;
  description: string;
}

export function VehicleFilter() {
  const searchParams = useSearchParams();
  const lenderId = searchParams.get('lenderId');
  const appId = searchParams.get('appId');
  const { preApprovals, setPreApprovals } = useApplicationStore();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [downPayment, setDownPayment] = useState(50000);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loanTerm] = useState(60);

  // Get approved amount for selected lender
  const approvedAmount =
    preApprovals.find((a) => a.lenderId === lenderId)?.maxLoanAmount || 0;
  const maxVehiclePrice = approvedAmount > 0 ? approvedAmount + downPayment : 500000; // Default max price if no approval found

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Re-fetch pre-approvals if missing
        if (preApprovals.length === 0 && appId) {
          const { creditApi } = await import('@/lib/api'); // Dynamic import to avoid circular dep if any
          const approvalRes = await creditApi.getPreApprovals(appId);
          const approvals = approvalRes.data.map((item: any, index: number) => ({
            lenderId: item.lender_id || `lender_${index}`,
            lenderName: item.lender_name,
            maxLoanAmount: item.max_amount,
            interestRate: item.apr,
            monthlyPayment: item.monthly_payment,
            terms: item.term,
            approved: item.status === 'approved',
          }));
          setPreApprovals(approvals);
        }

        // 2. Fetch vehicles
        const response = await vehicleApi.getVehicles(maxVehiclePrice, {
          sort: 'price_desc',
        });

        // Map response to match component interface
        const mappedVehicles = response.data.map((v: any) => ({
          ...v,
          imageUrl: v.image, // Map image to imageUrl
          dealerName: v.dealer_id === 'd1' ? 'Prestige Imports' : 'Luxury Auto Group', // Mock dealer name
        }));

        setVehicles(mappedVehicles);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [appId, preApprovals.length, downPayment]);

  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
  };

  const calculateMonthlyPayment = (price: number): number => {
    const loanAmount = Math.max(0, price - downPayment);
    const monthlyRate = 0.04 / 12; // Assuming 4% APR for demo
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1);
    return Math.round(monthlyPayment);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-luxury-red border-t-transparent"></div>
          <p className="mt-4 text-luxury-platinum/60">Curating your collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8">
        <h3 className="text-lg font-serif font-bold text-white mb-6 flex items-center">
          <span className="w-1 h-6 bg-luxury-red mr-3 rounded-full"></span>
          Refine Your Budget
        </h3>

        <div className="space-y-6">
          <div>
            <label className="flex items-center justify-between text-sm font-medium text-luxury-platinum/80 mb-4">
              <span>Down Payment</span>
              <span className="text-xl font-bold text-luxury-red font-mono">
                ${downPayment.toLocaleString()}
              </span>
            </label>
            <input
              type="range"
              min="10000"
              max={approvedAmount + 100000}
              step="5000"
              value={downPayment}
              onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
              className="w-full h-2 bg-luxury-charcoal rounded-lg appearance-none cursor-pointer accent-luxury-red"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div>
              <p className="text-xs text-luxury-platinum/50 uppercase tracking-wider mb-1">Pre-Approved Loan</p>
              <p className="text-2xl font-bold text-white font-mono">
                ${approvedAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-luxury-platinum/50 uppercase tracking-wider mb-1">Max Vehicle Price</p>
              <p className="text-2xl font-bold text-luxury-red font-mono">
                ${maxVehiclePrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div>
        <h3 className="text-xl font-serif font-bold text-white mb-6">
          Available Supercars <span className="text-luxury-platinum/50 text-lg font-sans font-normal ml-2">({vehicles.filter((v) => v.price <= maxVehiclePrice).length})</span>
        </h3>

        {selectedVehicle ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {/* Selected Vehicle Detail */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src={selectedVehicle.imageUrl}
                  alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="mt-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-4xl font-serif font-bold text-white">
                      {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                    </h2>
                    <p className="text-luxury-red text-lg mt-1">{selectedVehicle.color} • {selectedVehicle.mileage.toLocaleString()} miles</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white font-mono">${selectedVehicle.price.toLocaleString()}</p>
                  </div>
                </div>

                <p className="mt-6 text-luxury-platinum/80 leading-relaxed text-lg">{selectedVehicle.description}</p>

                <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
                  <h4 className="font-bold text-white mb-2">Dealer Information</h4>
                  <p className="text-luxury-platinum/80">{selectedVehicle.dealerName}</p>
                  <p className="text-sm text-luxury-platinum/50 mt-1">Verified Partner • White Glove Delivery Available</p>
                </div>
              </div>
            </div>

            {/* Pricing & Action */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-luxury-charcoal/80 backdrop-blur-md p-8 sticky top-24 shadow-xl">
                <h4 className="font-serif font-bold text-white text-xl mb-6 border-b border-white/10 pb-4">Financing Summary</h4>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-platinum/70">Vehicle Price</span>
                    <span className="font-bold text-white font-mono">
                      ${selectedVehicle.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-platinum/70">Down Payment</span>
                    <span className="font-bold text-white font-mono">
                      ${downPayment.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between">
                    <span className="text-luxury-platinum/70">Loan Amount</span>
                    <span className="font-bold text-luxury-red font-mono text-lg">
                      ${Math.max(0, selectedVehicle.price - downPayment).toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-luxury-red/10 border border-luxury-red/20 p-5 rounded-xl mt-6">
                    <p className="text-xs text-luxury-red uppercase tracking-wider mb-1">Est. Monthly Payment</p>
                    <p className="text-4xl font-bold text-white font-mono">
                      ${calculateMonthlyPayment(selectedVehicle.price)}<span className="text-lg text-luxury-platinum/50 font-sans font-normal">/mo</span>
                    </p>
                    <p className="text-xs text-luxury-platinum/50 mt-2 text-right">60 month term</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Proceed to lender connection
                    window.location.href = `/lender-connect?vehicleId=${selectedVehicle.id}&appId=${appId}&lenderId=${lenderId}`;
                  }}
                  className="w-full mt-8 rounded-full bg-luxury-red px-6 py-4 font-bold text-white hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 shadow-lg shadow-luxury-red/20"
                >
                  Proceed with This Vehicle
                </button>

                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="w-full mt-3 rounded-full border border-white/20 px-6 py-4 font-medium text-white hover:bg-white/10 transition duration-200"
                >
                  Browse More Vehicles
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles
              .filter((v) => v.price <= maxVehiclePrice)
              .map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="group rounded-2xl border border-white/5 bg-white/5 overflow-hidden hover:border-luxury-red/50 hover:shadow-[0_0_30px_-10px_rgba(208,0,0,0.3)] transition-all duration-300 text-left flex flex-col h-full"
                >
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    <img
                      src={vehicle.imageUrl}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-4 left-4 z-20">
                      <p className="text-white font-bold text-lg drop-shadow-md">{vehicle.year} {vehicle.make}</p>
                      <p className="text-luxury-red text-sm font-medium">{vehicle.model}</p>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-sm text-luxury-platinum/60">{vehicle.color} • {vehicle.mileage.toLocaleString()} mi</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-luxury-platinum/50 uppercase">Price</p>
                        <p className="text-xl font-bold text-white font-mono">${vehicle.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-luxury-platinum/50 uppercase">Est. Payment</p>
                        <p className="text-lg font-bold text-luxury-red font-mono">${calculateMonthlyPayment(vehicle.price)}/mo</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        )}

        {vehicles.filter((v) => v.price <= maxVehiclePrice).length === 0 && (
          <div className="rounded-2xl border border-luxury-red/20 bg-luxury-red/5 p-12 text-center">
            <p className="text-white font-serif text-xl mb-2">No Vehicles Available</p>
            <p className="text-luxury-platinum/60">
              No supercars are available within your current budget. Try increasing your down payment to unlock more inventory.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
