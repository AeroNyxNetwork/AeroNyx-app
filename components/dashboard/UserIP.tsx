'use client';

import { useState, useEffect } from 'react';
import { Globe, X, Shield, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DownloadModal from '@/components/dashboard/DownloadModal';

interface UserIPProps {
  onClose?: () => void;
}

interface IPInfo {
  ip: string;
  country: string;
  city: string;
  isp: string;
}

export default function UserIP({ onClose }: UserIPProps) {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  
  useEffect(() => {
    const fetchIPInfo = async () => {
      try {
        // In a real app, use a proper IP API like ipify or ipapi
        // This is a mock implementation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockIPInfo = {
          ip: '192.168.1.' + Math.floor(Math.random() * 255),
          country: 'United States',
          city: 'New York',
          isp: 'Example ISP'
        };
        
        setIpInfo(mockIPInfo);
      } catch (error) {
        console.error('Error fetching IP info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIPInfo();
  }, []);
  
  return (
    <>
      <div className="glass-card p-3 sm:p-4 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="bg-primary bg-opacity-20 p-2 rounded-full">
              <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              {isLoading ? (
                <div className="h-5 w-32 bg-gray-700 animate-pulse rounded-md" />
              ) : (
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                  <div className="text-xs sm:text-sm">
                    <span className="text-gray-400">IP:</span> {ipInfo?.ip}
                  </div>
                  
                  <div className="text-xs sm:text-sm hidden sm:block">
                    <span className="text-gray-400">Location:</span> {ipInfo?.city}, {ipInfo?.country}
                  </div>
                  
                  <div className="text-xs sm:text-sm hidden md:block">
                    <span className="text-gray-400">Provider:</span> {ipInfo?.isp}
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
