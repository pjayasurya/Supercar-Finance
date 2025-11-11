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
  const { preApprovals } = useApplicationStore();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [downPayment, setDownPayment] = useState(50000);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loanTerm] = useState(60);

  // Get approved amount for selected lender
  const approvedAmount =
    preApprovals.find((a) => a.lenderId === lenderId)?.maxLoanAmount || 0;
  const maxVehiclePrice = approvedAmount + downPayment;

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await vehicleApi.getVehicles(maxVehiclePrice, {
          sort: 'price_desc',
        });
        setVehicles(response.data);
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (approvedAmount > 0) {
      fetchVehicles();
    }
  }, [approvedAmount, downPayment]);

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
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-500"></div>
          <p className="mt-4 text-gray-600">Loading available vehicles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Budget</h3>

        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span>Down Payment</span>
              <span className="text-lg font-bold text-luxury-600">
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
              className="mt-2 w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-600">Pre-Approved Loan Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${approvedAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Max Vehicle Price</p>
              <p className="text-2xl font-bold text-luxury-600">
                ${maxVehiclePrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Available Supercars ({vehicles.filter((v) => v.price <= maxVehiclePrice).length})
        </h3>

        {selectedVehicle ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Selected Vehicle Detail */}
            <div className="lg:col-span-2">
              <div className="rounded-lg overflow-hidden">
                <img
                  src={selectedVehicle.imageUrl}
                  alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="mt-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                </h2>
                <p className="mt-2 text-gray-600">{selectedVehicle.color}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedVehicle.mileage.toLocaleString()} miles
                </p>
                <p className="mt-4 text-gray-700">{selectedVehicle.description}</p>

                <div className="mt-6 p-4 bg-luxury-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Dealer</h4>
                  <p className="text-gray-700">{selectedVehicle.dealerName}</p>
                </div>
              </div>
            </div>

            {/* Pricing & Action */}
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 sticky top-4">
                <h4 className="font-semibold text-gray-900 mb-4">Financing Summary</h4>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle Price</span>
                    <span className="font-semibold text-gray-900">
                      ${selectedVehicle.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment</span>
                    <span className="font-semibold text-gray-900">
                      ${downPayment.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="text-gray-600">Loan Amount</span>
                    <span className="font-semibold text-gray-900">
                      ${Math.max(0, selectedVehicle.price - downPayment).toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-luxury-50 p-4 rounded-lg mt-4">
                    <p className="text-xs text-gray-600 mb-1">Est. Monthly Payment (60 months)</p>
                    <p className="text-3xl font-bold text-luxury-600">
                      ${calculateMonthlyPayment(selectedVehicle.price)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Proceed to lender connection
                    window.location.href = `/lender-connect?vehicleId=${selectedVehicle.id}&appId=${appId}&lenderId=${lenderId}`;
                  }}
                  className="w-full mt-6 rounded-lg bg-luxury-500 px-4 py-3 font-semibold text-white hover:bg-luxury-600 transition duration-200"
                >
                  Proceed with This Vehicle
                </button>

                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Browse More
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles
              .filter((v) => v.price <= maxVehiclePrice)
              .map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className="rounded-lg border border-gray-200 overflow-hidden hover:border-luxury-500 hover:shadow-lg transition-all text-left"
                >
                  <img
                    src={vehicle.imageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{vehicle.color}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-luxury-600">
                        ${vehicle.price.toLocaleString()}
                      </span>
                      <span className="text-xs bg-luxury-100 text-luxury-700 px-2 py-1 rounded">
                        ${calculateMonthlyPayment(vehicle.price)}/mo
                      </span>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        )}

        {vehicles.filter((v) => v.price <= maxVehiclePrice).length === 0 && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
            <p className="text-gray-900 font-semibold">No Vehicles Available</p>
            <p className="mt-2 text-sm text-gray-600">
              No supercars are available within your budget. Try adjusting your down payment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
