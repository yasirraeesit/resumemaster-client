import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, ArrowLeft, Briefcase, DollarSign, Calendar } from 'lucide-react';


export default function JobTracker({ columns, setColumns }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState({ company: '', role: '', salary: '', date: '', notes: '' });

  const moveCard = (cardId, fromCol, toCol) => {
    setColumns(prev => {
      const sourceCol = prev[fromCol];
      const destCol = prev[toCol];
      const card = sourceCol.items.find(item => item.id === cardId);
      const remainingItems = sourceCol.items.filter(item => item.id !== cardId);

      return {
        ...prev,
        [fromCol]: {
          ...sourceCol,
          items: remainingItems
        },
        [toCol]: {
          ...destCol,
          items: [...destCol.items, card]
        }
      };
    });
  };

  const deleteCard = (cardId, colKey) => {
    setColumns(prev => {
      const col = prev[colKey];
      return {
        ...prev,
        [colKey]: {
          ...col,
          items: col.items.filter(item => item.id !== cardId)
        }
      };
    });
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJob.company || !newJob.role) return;

    const job = {
      id: Date.now().toString(),
      ...newJob,
      date: newJob.date || new Date().toISOString().split('T')[0]
    };

    setColumns(prev => ({
      ...prev,
      wishlist: {
        ...prev.wishlist,
        items: [...prev.wishlist.items, job]
      }
    }));

    setNewJob({ company: '', role: '', salary: '', date: '', notes: '' });
    setShowAddForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={22} className="logo-highlight" />
          Job Search Pipeline (Kanban)
        </h2>
        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} /> Add Application
        </button>
      </div>

      {showAddForm && (
        <form className="glass-card" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }} onSubmit={handleAddJob}>
          <div className="form-group">
            <label className="form-label">Company</label>
            <input className="form-input" required value={newJob.company} onChange={e => setNewJob(p => ({ ...p, company: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <input className="form-input" required value={newJob.role} onChange={e => setNewJob(p => ({ ...p, role: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Salary Range</label>
            <input className="form-input" placeholder="e.g. $120k - $140k" value={newJob.salary} onChange={e => setNewJob(p => ({ ...p, salary: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Target Date</label>
            <input type="date" className="form-input" value={newJob.date} onChange={e => setNewJob(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Notes</label>
            <input className="form-input" placeholder="Referral, core tech requirement details..." value={newJob.notes} onChange={e => setNewJob(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Add to Wishlist</button>
          </div>
        </form>
      )}

      <div className="kanban-board">
        {Object.entries(columns).map(([colKey, col], colIndex) => {
          const colKeys = Object.keys(columns);
          const prevCol = colKeys[colIndex - 1];
          const nextCol = colKeys[colIndex + 1];

          return (
            <div key={colKey} className="kanban-column">
              <div className="kanban-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }}></span>
                  {col.title}
                </span>
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px', color: 'var(--text-muted)' }}>
                  {col.items.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {col.items.map((job) => (
                  <div key={job.id} className="kanban-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{job.role}</h4>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }} onClick={() => deleteCard(job.id, colKey)}>
                        <Trash2 size={13} hover="color: red" />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-hover)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {job.company}
                    </div>
                    
                    {job.salary && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                        <DollarSign size={11} /> {job.salary}
                      </div>
                    )}
                    {job.date && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                        <Calendar size={11} /> {job.date}
                      </div>
                    )}

                    {job.notes && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', background: 'rgba(0,0,0,0.15)', padding: '0.4rem', borderRadius: '0.25rem', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.02)' }}>
                        {job.notes}
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '0.5rem' }}>
                      {prevCol ? (
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem' }} onClick={() => moveCard(job.id, colKey, prevCol)}>
                          <ArrowLeft size={11} /> Back
                        </button>
                      ) : <span />}
                      {nextCol ? (
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--color-primary-hover)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', fontWeight: 'bold' }} onClick={() => moveCard(job.id, colKey, nextCol)}>
                          Next <ArrowRight size={11} />
                        </button>
                      ) : <span />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
