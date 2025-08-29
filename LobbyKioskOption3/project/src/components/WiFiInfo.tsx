import React from 'react';
import { Wifi, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function WiFiInfo() {
  const [showPassword, setShowPassword] = useState(false);
  const wifiPassword = "Ambassador2024!";

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-dashed border-[#4c70b7]">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-[#4c70b7] p-2 rounded-lg">
          <Wifi className="text-white" size={18} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#221f20]">WiFi Network</h2>
          <p className="text-[#949699] text-sm">Complimentary Internet</p>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <label className="text-[#949699] text-sm">Network Name</label>
          <div className="bg-gray-50 rounded-lg p-2 font-mono text-[#25407b] font-bold text-sm">
            Ambassador_Guest
          </div>
        </div>
        
        <div>
          <label className="text-[#949699] text-sm">Password</label>
          <div className="bg-gray-50 rounded-lg p-2 flex items-center justify-between">
            <span className="font-mono text-[#25407b] font-bold text-sm">
              {showPassword ? wifiPassword : '••••••••••••'}
            </span>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#4c70b7] hover:text-[#25407b] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}