import { getTechnicians } from '@/actions/job';
import { addTechnician, deleteTechnician } from '@/actions/staff';
import { Users, UserPlus, Trash2 } from 'lucide-react';
import { SubmitButton } from '@/components/SubmitButton';

export default async function StaffPage() {
  const technicians = await getTechnicians();

  async function handleAdd(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    if (name) {
      await addTechnician(name, phone || undefined);
    }
  }

  async function handleDelete(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if (id) {
      await deleteTechnician(id);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Staff Management</h1>
          <p className="text-sm t-dim mt-1">Add or remove Mech / Tech.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add Mech / Tech Form */}
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <UserPlus size={18} className="text-indigo-400" />
              Add Mech / Tech
            </h2>
            <form action={handleAdd} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider t-muted mb-1.5">
                  Full Name
                </label>
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  className="themed-input w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider t-muted mb-1.5">
                  Phone Number <span className="t-dim normal-case font-normal">(optional)</span>
                </label>
                <input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  placeholder="e.g. 0300 1234567"
                  className="themed-input w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                />
              </div>
              <SubmitButton 
                label="Add Mech / Tech" 
                pendingLabel="Adding..." 
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 justify-center" 
              />
            </form>
          </div>
        </div>

        {/* Mech / Tech List */}
        <div className="md:col-span-2">
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="font-semibold">Active Mech / Tech</h2>
            </div>
            
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {technicians.length === 0 ? (
                <div className="p-8 text-center t-dim text-sm">
                  No Mech / Tech added yet.
                </div>
              ) : (
                technicians.map((tech) => (
                  <div key={tech.id} className="flex items-center justify-between p-6 table-row-hover transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold">
                        {tech.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold t-primary">{tech.name}</p>
                        <p className="text-xs t-dim mt-0.5">{tech.phone || tech.email || 'No contact info'}</p>
                      </div>
                    </div>
                    
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={tech.id} />
                      <button 
                        type="submit" 
                        title="Delete Mech / Tech"
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
