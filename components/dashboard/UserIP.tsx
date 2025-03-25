'use client';

import { useState, useEffect } from 'react';
import { Globe, X, Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DownloadModal from '@/components/dashboard/DownloadModal';
import { API_ENDPOINTS } from "@/components/api"
import axios from 'axios';
interface UserIPProps {
  onClose?: () => void;
}

interface IPInfo {
  ip: string;
  is_abuser: boolean;
  is_bogon: boolean;
  is_crawler: boolean;
  is_datacenter: boolean;
  is_mobile: boolean;
  is_proxy: boolean;
  is_satellite: boolean;
  is_tor: boolean;
  is_vpn: boolean;
  elapsed_ms: number;
  rir: string;

  abuse?: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };

  asn?: {
    asn: number;
    abuser_score: string;
    route: string;
    descr: string;
    country: string;
  };

  company?: {
    name: string;
    abuser_score: string;
    domain: string;
    type: string;
    network: string;
  };

  datacenter?: {
    datacenter: string;
    code: string;
    city: string;
    state: string;
    country: string;
  };

  location?: {
    is_eu_member: boolean;
    calling_code: string;
    currency_code: string;
    continent: string;
    country: string;
  };
}

export default function UserIP({ onClose }: UserIPProps) {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchIPData = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.GET_MYNODE_CITY}/json/`);
        const data = await response.json();
        if (data.ip) {
          const res = await axios.get(`${API_ENDPOINTS.API_DETAILS}?q=${data.ip}`);
          if (isMounted) {
            setIpInfo(res.data);
          }
        }
      } catch (error) {
        console.error("Error fetching IP info:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchIPData();

    return () => {
      isMounted = false;
    };
  }, []);





  return (
    <>
      <div className="glass-card p-3 sm:p-4 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            {/* <div className="bg-primary bg-opacity-20 p-2 rounded-full">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div> */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              {isLoading ? (
                <div className="h-5 w-32 bg-gray-700 animate-pulse rounded-md" />
              ) : (
                <div className="flex flex-col sm:flex-row sm:space-x-4 ">
                  <div className="text-xs sm:text-sm mb-1">
                    <span className="text-gray-400">IP:</span> {ipInfo?.ip || "Unknown"}
                  </div>


                  <div className="text-xs sm:text-sm mb-1">
                    <span className="text-gray-400">Location:</span>
                    {ipInfo?.datacenter?.city || "Unknown"}, {ipInfo?.datacenter?.country || "Unknown"}
                  </div>


                  <div className="text-xs sm:text-sm mb-1">
                    <span className="text-gray-400">Provider:</span> {ipInfo?.abuse?.address || "Unknown"}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-gray-700 hover:bg-gray-800 hidden sm:flex"
              onClick={() => setShowDownloadModal(true)}
            >
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              <span className="hidden md:inline">Download Privacy Client</span>
              <span className="md:hidden">Get Privacy Client</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-xs border-gray-700 hover:bg-gray-800 sm:hidden"
              onClick={() => setShowDownloadModal(true)}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>

            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showDownloadModal && (
        <DownloadModal
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
        />
      )}
    </>
  );
}
