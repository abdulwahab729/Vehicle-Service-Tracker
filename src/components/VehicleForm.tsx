'use client';

import { useState, useRef, useEffect } from 'react';
import { SubmitButton } from '@/components/SubmitButton';
import { Customer } from '@prisma/client';
import { Check, ChevronsUpDown } from 'lucide-react';

const VEHICLE_MAKES_MODELS: Record<string, string[]> = {
  'Toyota': ['Corolla', 'Yaris', 'Fortuner', 'Hilux', 'Prado', 'Camry', 'Prius', 'Aqua', 'Vitz', 'Passo', 'Land Cruiser'],
  'Suzuki': ['Alto', 'Cultus', 'Wagon R', 'Swift', 'Mehran', 'Bolan', 'Ravi', 'Every', 'Jimny'],
  'Honda': ['Civic', 'City', 'BR-V', 'HR-V', 'Vezel', 'Fit', 'Accord'],
  'KIA': ['Sportage', 'Picanto', 'Stonic', 'Sorento', 'Carnival'],
  'Hyundai': ['Tucson', 'Elantra', 'Sonata', 'Santa Fe'],
  'Changan': ['Alsvin', 'Oshan X7', 'Karvaan', 'M9'],
  'MG': ['HS', 'ZS', 'MG3'],
  'Daihatsu': ['Mira', 'Cuore', 'Move', 'Cast', 'Hijet'],
  'Other': []
};

const PAKISTAN_MAKES = Object.keys(VEHICLE_MAKES_MODELS);
const COLORS = ['White','Silver','Grey','Black','Red','Blue','Green','Beige','Brown','Golden'];

const inputCls = "themed-input w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/40 transition-all";
const selectCls = "themed-input w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/40 transition-all";
const labelCls = "block text-xs font-semibold uppercase tracking-wider t-muted mb-1.5";
const sectionStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)' };

export function VehicleForm({ 
  customers, 
  action 
}: { 
  customers: Customer[], 
  action: (formData: FormData) => Promise<void> 
}) {
  const [selectedMake, setSelectedMake] = useState('');
  
  // Custom Searchable Dropdown State for Customer
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCustomerDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.firstName.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.lastName || '').toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  );

  return (
    <form action={action} className="rounded-2xl border p-7 space-y-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      
      {/* Hidden input to pass customer ID to server action (made focusable for HTML5 validation) */}
      <input type="text" name="customerId" value={selectedCustomer?.id || ''} required className="opacity-0 absolute h-0 w-0 z-[-1]" readOnly />

      {/* Customer Search Combobox */}
      <div className="relative" ref={dropdownRef}>
        <label className={labelCls}>Vehicle Owner <span className="text-rose-500 normal-case">*</span></label>
        <div 
          className="relative cursor-pointer"
          onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
        >
          <div className={`${inputCls} flex items-center justify-between min-h-[44px]`} style={sectionStyle}>
            <span className={selectedCustomer ? "text-slate-900 dark:text-white" : "t-dim"}>
              {selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName || ''} (${selectedCustomer.phone})` : "— Select or Search a Customer —"}
            </span>
            <ChevronsUpDown size={16} className="t-dim" />
          </div>
        </div>

        {isCustomerDropdownOpen && (
          <div className="absolute z-10 w-full mt-2 rounded-xl border shadow-xl max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2" 
               style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="p-2 sticky top-0 bg-inherit border-b" style={{ borderColor: 'var(--border)' }}>
              <input
                type="text"
                placeholder="Search by name or phone..."
                className="w-full px-3 py-2 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-teal-500/40 bg-transparent text-slate-900 dark:text-white"
                style={{ borderColor: 'var(--border)' }}
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="p-1">
              {filteredCustomers.length === 0 ? (
                <div className="p-3 text-sm text-center t-dim">No customers found.</div>
              ) : (
                filteredCustomers.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomer(c);
                      setIsCustomerDropdownOpen(false);
                      setCustomerSearch('');
                    }}
                    className={`flex items-center justify-between p-2.5 text-sm rounded-lg cursor-pointer transition-colors
                      ${selectedCustomer?.id === c.id ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-medium' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}
                    `}
                  >
                    <span>{c.firstName} {c.lastName || ''} <span className="t-dim ml-1">({c.phone})</span></span>
                    {selectedCustomer?.id === c.id && <Check size={16} />}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="make" className={labelCls}>Make <span className="text-rose-500 normal-case">*</span></label>
          <select 
            id="make" 
            required 
            name="make" 
            className={selectCls} 
            style={sectionStyle}
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
          >
            <option value="">— Select Make —</option>
            {PAKISTAN_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="model" className={labelCls}>Model <span className="text-rose-500 normal-case">*</span></label>
          <select 
            id="model" 
            required 
            name="model" 
            className={selectCls} 
            style={sectionStyle}
            disabled={!selectedMake || selectedMake === 'Other'}
          >
            <option value="">{selectedMake === 'Other' ? 'Enter manually below' : '— Select Model —'}</option>
            {selectedMake && VEHICLE_MAKES_MODELS[selectedMake]?.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="year" className={labelCls}>Year <span className="text-rose-500 normal-case">*</span></label>
          <input 
            id="year" 
            required 
            name="year" 
            type="number" 
            min="1980" 
            max={new Date().getFullYear() + 1} 
            placeholder={new Date().getFullYear().toString()}
            className={inputCls} 
            style={sectionStyle} 
          />
        </div>
      </div>

      {/* Manual make/model entry for "Other" */}
      {selectedMake === 'Other' && (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in">
          <div>
            <label htmlFor="manualMake" className={labelCls}>Custom Make</label>
            <input id="manualMake" name="manualMake" type="text" placeholder="e.g. BMW" className={inputCls} style={sectionStyle} />
          </div>
          <div>
            <label htmlFor="manualModel" className={labelCls}>Custom Model</label>
            <input id="manualModel" name="manualModel" type="text" placeholder="e.g. X5" className={inputCls} style={sectionStyle} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="licensePlate" className={labelCls}>Registration No. <span className="text-rose-500 normal-case">*</span></label>
          <input id="licensePlate" required name="licensePlate" type="text" placeholder="LEA-1234"
            className={`${inputCls} uppercase font-mono tracking-widest`} style={sectionStyle} />
          <p className="text-[11px] t-dim mt-1.5">e.g. LEA-1234, ABC-123</p>
        </div>
        <div>
          <label htmlFor="color" className={labelCls}>Color <span className="t-dim normal-case font-normal">(optional)</span></label>
          <input id="color" name="color" type="text" list="colors-list" placeholder="White"
            className={inputCls} style={sectionStyle} />
          <datalist id="colors-list">{COLORS.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
      </div>

      <div>
        <label htmlFor="vin" className={labelCls}>Chassis / VIN <span className="t-dim normal-case font-normal">(optional)</span></label>
        <input id="vin" name="vin" type="text" placeholder="e.g. JT2BG22K1W0080512"
          className={`${inputCls} uppercase font-mono`} style={sectionStyle} />
        <p className="text-[11px] t-dim mt-1.5">Leave blank for locally assembled vehicles</p>
      </div>

      <div className="pt-2 flex justify-end">
        <SubmitButton label="Save Vehicle" pendingLabel="Saving..."
          className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-lg shadow-teal-500/25" />
      </div>
    </form>
  );
}
