import React, { useState, useEffect } from 'react';
import { tokens } from '../../styles/tokens';
import { motion, AnimatePresence } from 'framer-motion';

const LABELS = {
  BUG: '#F87171',
  FEATURE: '#4ADE80',
  DESIGN: '#8B5CF6',
  URGENT: '#E8A020',
};

const PRIORITIES = {
  low: tokens.colors.textTertiary,
  medium: '#E8A020',
  high: '#F87171',
};

const INITIAL_CARDS = [
  { id: '1', title: 'Try the terminal easter eggs', column: 'TODO', priority: 'medium', label: 'FEATURE', created: Date.now() - 100000 },
  { id: '2', title: 'Install Code Editor from App Store', column: 'TODO', priority: 'low', label: 'FEATURE', created: Date.now() - 80000 },
  { id: '3', title: 'Explore all wallpapers', column: 'IN PROGRESS', priority: 'low', label: 'DESIGN', created: Date.now() - 60000 },
  { id: '4', title: 'Open SMIT OS for the first time', column: 'DONE', priority: 'low', label: 'FEATURE', created: Date.now() - 40000 },
];

export default function Kanban() {
  const [cards, setCards] = useState([]);
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  
  const [addingToCol, setAddingToCol] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardPriority, setNewCardPriority] = useState('low');
  const [newCardLabel, setNewCardLabel] = useState('');

  const [editingCardId, setEditingCardId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Persist state
  useEffect(() => {
    const saved = localStorage.getItem('smit-os-kanban');
    if (saved) {
      try { setCards(JSON.parse(saved)); } catch(e) { setCards(INITIAL_CARDS); }
    } else {
      setCards(INITIAL_CARDS);
    }
  }, []);

  useEffect(() => {
    if (cards.length > 0 || localStorage.getItem('smit-os-kanban')) {
      localStorage.setItem('smit-os-kanban', JSON.stringify(cards));
    }
  }, [cards]);

  const addCard = (column) => {
    if (!newCardTitle.trim()) {
      setAddingToCol(null);
      return;
    }
    const newCard = {
      id: Date.now().toString(),
      title: newCardTitle.trim(),
      column,
      priority: newCardPriority,
      label: newCardLabel,
      created: Date.now(),
    };
    setCards([...cards, newCard]);
    setAddingToCol(null);
    setNewCardTitle('');
    setNewCardPriority('low');
    setNewCardLabel('');
  };

  const deleteCard = (id) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      setCards([]);
      localStorage.removeItem('smit-os-kanban');
    }
  };

  const startEdit = (id, title) => {
    setEditingCardId(id);
    setEditTitle(title);
  };

  const saveEdit = (id) => {
    if (editTitle.trim()) {
      setCards(cards.map(c => c.id === id ? { ...c, title: editTitle.trim() } : c));
    }
    setEditingCardId(null);
  };

  const handleDragStart = (e, id) => {
    setDraggedCardId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e, column) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== column) {
      setDragOverColumn(column);
    }
  };

  const handleDragLeave = (e, column) => {
    if (dragOverColumn === column) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, column) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      setCards(cards.map(c => c.id === id ? { ...c, column } : c));
    }
    setDragOverColumn(null);
    setDraggedCardId(null);
  };

  const handleDragEnd = () => {
    setDragOverColumn(null);
    setDraggedCardId(null);
  };

  const renderColumn = (title) => {
    const columnCards = cards.filter(c => c.column === title);
    const isDragOver = dragOverColumn === title;

    return (
      <div
        key={title}
        onDragOver={(e) => handleDragOver(e, title)}
        onDragLeave={(e) => handleDragLeave(e, title)}
        onDrop={(e) => handleDrop(e, title)}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: tokens.colors.bgCanvas,
          border: `1px solid ${isDragOver ? 'var(--os-accent)' : tokens.colors.borderSubtle}`,
          borderRadius: '4px',
          padding: '16px',
          minWidth: '280px',
          transition: 'all 0.2s',
          ...(isDragOver ? { backgroundColor: tokens.colors.accentMuted } : {})
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: tokens.colors.textPrimary, letterSpacing: '0.05em', fontFamily: tokens.typography.fontMono }}>
            {title}
          </div>
          <div style={{ fontSize: '10px', color: tokens.colors.textTertiary, backgroundColor: tokens.colors.bgSurface, padding: '2px 6px', borderRadius: '12px', fontFamily: tokens.typography.fontMono }}>
            {columnCards.length}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <AnimatePresence>
            {columnCards.length === 0 && !addingToCol ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  border: `1px dashed ${tokens.colors.borderFaint}`,
                  padding: '24px',
                  textAlign: 'center',
                  fontSize: '11px',
                  color: tokens.colors.textTertiary,
                  borderRadius: '4px'
                }}
              >
                Drop cards here
              </motion.div>
            ) : null}

            {columnCards.map(c => (
              <motion.div
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: draggedCardId === c.id ? 0.4 : 1, y: 0, rotate: draggedCardId === c.id ? 2 : 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                key={c.id}
                draggable={editingCardId !== c.id}
                onDragStart={(e) => handleDragStart(e, c.id)}
                onDragEnd={handleDragEnd}
                style={{
                  backgroundColor: tokens.colors.bgSurface,
                  border: `1px solid ${tokens.colors.borderSubtle}`,
                  borderLeft: `3px solid ${PRIORITIES[c.priority]}`,
                  borderRadius: '4px',
                  padding: '12px',
                  cursor: editingCardId === c.id ? 'default' : 'grab',
                  position: 'relative',
                }}
                className="kanban-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', minHeight: '18px' }}>
                  {c.label ? (
                    <div style={{ fontSize: '9px', fontWeight: 600, color: LABELS[c.label], backgroundColor: `${LABELS[c.label]}22`, padding: '2px 6px', borderRadius: '12px', fontFamily: tokens.typography.fontMono }}>
                      {c.label}
                    </div>
                  ) : <div />}
                  <button
                    onClick={() => deleteCard(c.id)}
                    className="kanban-delete-btn"
                    title="Delete card"
                    style={{ background: 'transparent', border: 'none', color: tokens.colors.textTertiary, cursor: 'pointer', fontSize: '14px', lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>

                {editingCardId === c.id ? (
                  <textarea
                    autoFocus
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onBlur={() => saveEdit(c.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        saveEdit(c.id);
                      }
                      if (e.key === 'Escape') {
                        setEditingCardId(null);
                      }
                    }}
                    style={{ width: '100%', background: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, fontSize: '12px', fontFamily: tokens.typography.fontSans, outline: 'none', resize: 'vertical', padding: '8px', marginBottom: '12px', minHeight: '60px' }}
                  />
                ) : (
                  <div
                    onDoubleClick={() => startEdit(c.id, c.title)}
                    title="Double-click to edit"
                    style={{ fontSize: '13px', color: tokens.colors.textPrimary, lineHeight: '1.6', marginBottom: '12px', wordWrap: 'break-word', cursor: 'text' }}
                  >
                    {c.title}
                  </div>
                )}

                <div style={{ fontSize: '9px', color: tokens.colors.textTertiary, fontFamily: tokens.typography.fontMono }}>
                  {new Date(c.created).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {addingToCol === title && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: tokens.colors.bgSurface,
                border: `1px solid ${tokens.colors.borderSubtle}`,
                borderRadius: '4px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <textarea
                autoFocus
                value={newCardTitle}
                onChange={e => setNewCardTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addCard(title);
                  }
                  if (e.key === 'Escape') setAddingToCol(null);
                }}
                placeholder="Task title..."
                style={{ width: '100%', background: 'transparent', border: 'none', color: tokens.colors.textPrimary, fontSize: '12px', fontFamily: tokens.typography.fontSans, outline: 'none', resize: 'vertical', minHeight: '40px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <select
                    value={newCardPriority}
                    onChange={e => setNewCardPriority(e.target.value)}
                    style={{ fontSize: '10px', backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderFaint}`, color: tokens.colors.textSecondary, outline: 'none', fontFamily: tokens.typography.fontMono }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Med</option>
                    <option value="high">High</option>
                  </select>
                  <select
                    value={newCardLabel}
                    onChange={e => setNewCardLabel(e.target.value)}
                    style={{ fontSize: '10px', backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderFaint}`, color: tokens.colors.textSecondary, outline: 'none', fontFamily: tokens.typography.fontMono }}
                  >
                    <option value="">No Label</option>
                    {Object.keys(LABELS).map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={() => setAddingToCol(null)} style={{ background: 'transparent', border: 'none', color: tokens.colors.textTertiary, cursor: 'pointer', fontSize: '10px', fontFamily: tokens.typography.fontMono }}>CANCEL</button>
                  <button onClick={() => addCard(title)} style={{ background: 'var(--os-accent)', border: 'none', color: tokens.colors.bgCanvas, cursor: 'pointer', fontSize: '10px', padding: '4px 8px', borderRadius: '2px', fontWeight: 600, fontFamily: tokens.typography.fontMono }}>ADD</button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {!addingToCol && (
          <button
            onClick={() => {
              setAddingToCol(title);
              setNewCardTitle('');
              setNewCardPriority('low');
              setNewCardLabel('');
            }}
            style={{
              marginTop: '16px',
              padding: '8px',
              backgroundColor: 'transparent',
              border: `1px dashed ${tokens.colors.borderSubtle}`,
              color: tokens.colors.textTertiary,
              fontSize: '11px',
              fontFamily: tokens.typography.fontMono,
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'all 0.1s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--os-accent)'}
            onMouseLeave={e => e.currentTarget.style.color = tokens.colors.textTertiary}
          >
            + Add card
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .kanban-card .kanban-delete-btn { opacity: 0; transition: opacity 0.1s; }
        .kanban-card:hover .kanban-delete-btn { opacity: 1; }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: tokens.colors.bgSurface, fontFamily: tokens.typography.fontSans, overflow: 'hidden' }}>
        
        {/* HEADER */}
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${tokens.colors.borderSubtle}`, backgroundColor: tokens.colors.bgCanvas, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '12px', color: tokens.colors.textTertiary, letterSpacing: '0.1em', fontFamily: tokens.typography.fontMono, fontWeight: 600 }}>
              // KANBAN
            </div>
            <div style={{ width: '1px', height: '16px', backgroundColor: tokens.colors.borderSubtle }} />
            <div style={{ fontSize: '12px', color: tokens.colors.textSecondary }}>
              {cards.length} total tasks
            </div>
          </div>
          <button
            onClick={clearAll}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: `1px solid ${tokens.colors.borderFaint}`,
              color: tokens.colors.textTertiary,
              fontSize: '10px',
              fontFamily: tokens.typography.fontMono,
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'all 0.1s'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F87171'; e.currentTarget.style.borderColor = '#F87171'; }}
            onMouseLeave={e => { e.currentTarget.style.color = tokens.colors.textTertiary; e.currentTarget.style.borderColor = tokens.colors.borderFaint; }}
          >
            CLEAR ALL
          </button>
        </div>

        {/* BOARD */}
        <div style={{ flex: 1, padding: '24px', display: 'flex', gap: '24px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {renderColumn('TODO')}
          {renderColumn('IN PROGRESS')}
          {renderColumn('DONE')}
        </div>

      </div>
    </>
  );
}
