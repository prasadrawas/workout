import { useState } from 'react';
import type { DayOfWeek, Exercise, WorkoutPlan } from '../types/workout';
import { exportPlanJSON, importPlanJSON } from '../utils/storage';
import { 
  X, 
  Layers, 
  Check, 
  Plus, 
  Copy, 
  Trash2, 
  Download, 
  Upload, 
  Edit3, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

interface PlanManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: WorkoutPlan[];
  activePlanId: string;
  onSelectPlan: (planId: string) => void;
  onSavePlans: (updatedPlans: WorkoutPlan[]) => void;
}

export function PlanManagerModal({
  isOpen,
  onClose,
  plans,
  activePlanId,
  onSelectPlan,
  onSavePlans
}: PlanManagerModalProps) {
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'import'>('list');
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState('');

  // Edit sub-state for selected day & session
  const [editDayId, setEditDayId] = useState<DayOfWeek>('monday');
  const [editSessionType, setEditSessionType] = useState<'morning' | 'evening'>('morning');

  if (!isOpen) return null;

  // Handle Switch Plan
  const handleSelect = (id: string) => {
    onSelectPlan(id);
    onClose();
  };

  // Handle Duplicate / Clone
  const handleClone = (planToClone: WorkoutPlan) => {
    const newPlan: WorkoutPlan = {
      ...JSON.parse(JSON.stringify(planToClone)),
      id: `plan-${Date.now()}`,
      name: `${planToClone.name} (Copy)`,
      isCustom: true
    };
    const updated = [...plans, newPlan];
    onSavePlans(updated);
  };

  // Handle Delete
  const handleDelete = (id: string) => {
    if (plans.length <= 1) {
      alert('You must have at least one workout plan.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this workout plan?')) {
      const updated = plans.filter((p) => p.id !== id);
      onSavePlans(updated);
      if (activePlanId === id) {
        onSelectPlan(updated[0].id);
      }
    }
  };

  // Handle Export Single Plan
  const handleExportPlan = (plan: WorkoutPlan) => {
    const jsonStr = exportPlanJSON(plan);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Import Submit
  const handleImportSubmit = () => {
    setImportError('');
    if (!importJsonText.trim()) {
      setImportError('Please paste a workout plan JSON object.');
      return;
    }
    const imported = importPlanJSON(importJsonText);
    if (!imported) {
      setImportError('Invalid JSON structure. Ensure it has "name" and "days" array.');
      return;
    }
    const updated = [...plans, imported];
    onSavePlans(updated);
    onSelectPlan(imported.id);
    setViewMode('list');
    setImportJsonText('');
  };

  // Handle File Upload Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  // Start creating new empty plan
  const handleCreateNew = () => {
    const newPlan: WorkoutPlan = {
      id: `plan-${Date.now()}`,
      name: 'New Custom Workout Routine',
      focusTag: 'Custom Split',
      description: 'Personalized routine created in Plan Manager.',
      isCustom: true,
      days: [
        {
          dayId: 'monday',
          dayName: 'Monday',
          shortName: 'Mon',
          morning: {
            id: `plan-${Date.now()}-mon-m`,
            title: 'Upper Body A',
            subtitle: 'Push & Pull',
            location: 'Gym',
            durationEstimate: '45-60 min',
            exercises: [
              {
                id: `ex-${Date.now()}-1`,
                name: 'Bench Press or Push Up',
                targetSets: 3,
                targetReps: '10–12 reps',
                defaultRestSec: 90,
                category: 'push',
                met: 4.5,
                durationSecPerSet: 45
              }
            ]
          },
          evening: {
            id: `plan-${Date.now()}-mon-e`,
            title: 'Mobility & Stretching',
            subtitle: 'Recovery',
            location: 'Home',
            durationEstimate: '15 min',
            exercises: []
          }
        },
        {
          dayId: 'tuesday',
          dayName: 'Tuesday',
          shortName: 'Tue',
          morning: {
            id: `plan-${Date.now()}-tue-m`,
            title: 'Lower Body A',
            subtitle: 'Legs & Core',
            location: 'Gym',
            durationEstimate: '45-60 min',
            exercises: []
          },
          evening: {
            id: `plan-${Date.now()}-tue-e`,
            title: 'Hip & Pelvic Mobility',
            subtitle: 'Recovery',
            location: 'Home',
            durationEstimate: '15 min',
            exercises: []
          }
        },
        {
          dayId: 'wednesday',
          dayName: 'Wednesday',
          shortName: 'Wed',
          morning: {
            id: `plan-${Date.now()}-wed-m`,
            title: 'Rest or Light Cardio',
            subtitle: 'Active Recovery',
            location: 'Home',
            durationEstimate: '30 min',
            exercises: []
          },
          evening: {
            id: `plan-${Date.now()}-wed-e`,
            title: 'Gentle Flow',
            subtitle: 'Mobility',
            location: 'Home',
            durationEstimate: '15 min',
            exercises: []
          }
        },
        {
          dayId: 'thursday',
          dayName: 'Thursday',
          shortName: 'Thu',
          morning: {
            id: `plan-${Date.now()}-thu-m`,
            title: 'Upper Body B',
            subtitle: 'Shoulders & Arms',
            location: 'Gym',
            durationEstimate: '45-60 min',
            exercises: []
          },
          evening: {
            id: `plan-${Date.now()}-thu-e`,
            title: 'Thoracic Reset',
            subtitle: 'Recovery',
            location: 'Home',
            durationEstimate: '15 min',
            exercises: []
          }
        },
        {
          dayId: 'friday',
          dayName: 'Friday',
          shortName: 'Fri',
          morning: {
            id: `plan-${Date.now()}-fri-m`,
            title: 'Lower Body B',
            subtitle: 'Glutes & Posterior Chain',
            location: 'Gym',
            durationEstimate: '45-60 min',
            exercises: []
          },
          evening: {
            id: `plan-${Date.now()}-fri-e`,
            title: 'Hamstring & Lower Back Release',
            subtitle: 'Recovery',
            location: 'Home',
            durationEstimate: '15 min',
            exercises: []
          }
        },
        {
          dayId: 'saturday',
          dayName: 'Saturday',
          shortName: 'Sat',
          morning: {
            id: `plan-${Date.now()}-sat-m`,
            title: 'Full Body Conditioning',
            subtitle: 'Core & Functional',
            location: 'Gym',
            durationEstimate: '40 min',
            exercises: []
          },
          evening: {
            id: `plan-${Date.now()}-sat-e`,
            title: 'Weekend Unwind',
            subtitle: 'Recovery',
            location: 'Home',
            durationEstimate: '15 min',
            exercises: []
          }
        },
        {
          dayId: 'sunday',
          dayName: 'Sunday',
          shortName: 'Sun',
          morning: {
            id: `plan-${Date.now()}-sun-m`,
            title: 'Rest & Leisure Walk',
            subtitle: 'Recharge',
            location: 'Home',
            durationEstimate: '30 min',
            exercises: []
          },
          evening: {
            id: `plan-${Date.now()}-sun-e`,
            title: 'Breathing & Weekly Alignment',
            subtitle: 'Recovery',
            location: 'Home',
            durationEstimate: '15 min',
            exercises: []
          }
        }
      ]
    };
    setEditingPlan(newPlan);
    setViewMode('edit');
  };

  // Start editing existing plan
  const handleStartEdit = (plan: WorkoutPlan) => {
    setEditingPlan(JSON.parse(JSON.stringify(plan)));
    setViewMode('edit');
  };

  // Save changes to editing plan
  const handleSaveEdit = () => {
    if (!editingPlan) return;
    const exists = plans.some((p) => p.id === editingPlan.id);
    let updated: WorkoutPlan[];
    if (exists) {
      updated = plans.map((p) => (p.id === editingPlan.id ? editingPlan : p));
    } else {
      updated = [...plans, editingPlan];
    }
    onSavePlans(updated);
    setViewMode('list');
    setEditingPlan(null);
  };

  // Add exercise to current editing day/session
  const handleAddExerciseToEditing = () => {
    if (!editingPlan) return;
    const targetDay = editingPlan.days.find((d) => d.dayId === editDayId);
    if (!targetDay) return;
    const targetSession = editSessionType === 'morning' ? targetDay.morning : targetDay.evening;
    if (!targetSession) return;

    const newEx: Exercise = {
      id: `ex-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: 'New Exercise',
      targetSets: 3,
      targetReps: '10–12 reps',
      defaultRestSec: 60,
      category: editSessionType === 'morning' ? 'push' : 'mobility',
      met: editSessionType === 'morning' ? 4.0 : 2.3,
      durationSecPerSet: 40
    };

    targetSession.exercises.push(newEx);
    setEditingPlan({ ...editingPlan });
  };

  // Remove exercise from editing plan
  const handleRemoveExerciseFromEditing = (exId: string) => {
    if (!editingPlan) return;
    const targetDay = editingPlan.days.find((d) => d.dayId === editDayId);
    if (!targetDay) return;
    const targetSession = editSessionType === 'morning' ? targetDay.morning : targetDay.evening;
    if (!targetSession) return;

    targetSession.exercises = targetSession.exercises.filter((e) => e.id !== exId);
    setEditingPlan({ ...editingPlan });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content plan-manager-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            {viewMode !== 'list' ? (
              <button 
                className="btn-back"
                onClick={() => {
                  setViewMode('list');
                  setEditingPlan(null);
                }}
                title="Back to plans"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="modal-icon-badge">
                <Layers size={18} />
              </div>
            )}
            <div>
              <h2 className="modal-title">
                {viewMode === 'list' && 'Workout Plans'}
                {viewMode === 'edit' && 'Edit Workout Plan'}
                {viewMode === 'import' && 'Import Plan (JSON)'}
              </h2>
              <div className="modal-subtitle">
                {viewMode === 'list' && `${plans.length} available routines`}
                {viewMode === 'edit' && editingPlan?.name}
                {viewMode === 'import' && 'Paste JSON or upload a file'}
              </div>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* ========================================================
            VIEW MODE: LIST ALL PLANS
            ======================================================== */}
        {viewMode === 'list' && (
          <div className="plan-list-container">
            <div className="plan-action-toolbar">
              <button className="btn-tool-action primary" onClick={handleCreateNew}>
                <Plus size={16} />
                <span>Create Plan</span>
              </button>
              <button className="btn-tool-action secondary" onClick={() => setViewMode('import')}>
                <Upload size={16} />
                <span>Import JSON</span>
              </button>
              <a 
                href="./plan.example.json" 
                download="plan.example.json" 
                className="btn-tool-action secondary"
                title="Download plan.example.json template"
                style={{ textDecoration: 'none' }}
              >
                <Download size={16} />
                <span>Download .example Template</span>
              </a>
            </div>

            <div className="plans-grid">
              {plans.map((plan) => {
                const isActive = plan.id === activePlanId;
                const totalExercises = plan.days.reduce(
                  (sum, d) => sum + (d.morning?.exercises?.length || 0) + (d.evening?.exercises?.length || 0),
                  0
                );

                return (
                  <div 
                    key={plan.id} 
                    className={`plan-card-item ${isActive ? 'active-plan' : ''}`}
                  >
                    <div className="plan-card-top">
                      <div className="plan-badge-group">
                        {isActive && (
                          <span className="badge-active">
                            <Check size={12} /> Active Plan
                          </span>
                        )}
                        {plan.focusTag && (
                          <span className="badge-tag">{plan.focusTag}</span>
                        )}
                      </div>
                      <div className="plan-meta-stats">
                        <span>{plan.days.length} Days</span>
                        <span>•</span>
                        <span>{totalExercises} Exercises</span>
                      </div>
                    </div>

                    <h3 className="plan-name">{plan.name}</h3>
                    {plan.description && (
                      <p className="plan-description">{plan.description}</p>
                    )}

                    <div className="plan-card-actions">
                      {!isActive ? (
                        <button 
                          className="btn-plan-select"
                          onClick={() => handleSelect(plan.id)}
                        >
                          Switch to this Plan
                        </button>
                      ) : (
                        <div className="active-indicator-label">
                          Currently Active
                        </div>
                      )}

                      <div className="plan-icon-buttons">
                        <button 
                          className="btn-icon-subtle" 
                          onClick={() => handleStartEdit(plan)}
                          title="Edit plan"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          className="btn-icon-subtle" 
                          onClick={() => handleClone(plan)}
                          title="Duplicate plan"
                        >
                          <Copy size={15} />
                        </button>
                        <button 
                          className="btn-icon-subtle" 
                          onClick={() => handleExportPlan(plan)}
                          title="Export plan JSON"
                        >
                          <Download size={15} />
                        </button>
                        {plans.length > 1 && (
                          <button 
                            className="btn-icon-subtle delete" 
                            onClick={() => handleDelete(plan.id)}
                            title="Delete plan"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW MODE: EDIT PLAN
            ======================================================== */}
        {viewMode === 'edit' && editingPlan && (
          <div className="plan-edit-container">
            {/* Basic Info */}
            <div className="edit-form-section">
              <label className="form-label">Plan Name</label>
              <input 
                type="text" 
                className="form-input" 
                value={editingPlan.name}
                onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                placeholder="e.g. 4-Day Strength Routine"
              />
            </div>

            <div className="edit-form-row">
              <div className="edit-form-section flex-1">
                <label className="form-label">Focus / Tag</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingPlan.focusTag || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, focusTag: e.target.value })}
                  placeholder="e.g. Hypertrophy, Mobility, Rehab"
                />
              </div>
            </div>

            <div className="edit-form-section">
              <label className="form-label">Description</label>
              <textarea 
                className="form-textarea" 
                rows={2}
                value={editingPlan.description || ''}
                onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                placeholder="Short summary of this program..."
              />
            </div>

            {/* Day & Session Sub-Selector */}
            <div className="edit-day-selector-section">
              <label className="form-label">Select Day & Session to Edit</label>
              <div className="edit-day-pills">
                {editingPlan.days.map((d) => (
                  <button 
                    key={d.dayId}
                    type="button"
                    className={`btn-day-pill ${editDayId === d.dayId ? 'active' : ''}`}
                    onClick={() => setEditDayId(d.dayId)}
                  >
                    {d.shortName}
                  </button>
                ))}
              </div>

              <div className="edit-session-pills">
                <button
                  type="button"
                  className={`btn-session-pill ${editSessionType === 'morning' ? 'active' : ''}`}
                  onClick={() => setEditSessionType('morning')}
                >
                  Morning Session
                </button>
                <button
                  type="button"
                  className={`btn-session-pill ${editSessionType === 'evening' ? 'active' : ''}`}
                  onClick={() => setEditSessionType('evening')}
                >
                  Evening Session
                </button>
              </div>
            </div>

            {/* Exercises in Selected Day & Session */}
            {(() => {
              const currentDay = editingPlan.days.find((d) => d.dayId === editDayId);
              const currentSession = editSessionType === 'morning' ? currentDay?.morning : currentDay?.evening;
              if (!currentSession) return null;

              return (
                <div className="edit-session-exercises-card">
                  <div className="edit-session-header">
                    <div>
                      <h4 className="session-edit-title">{currentSession.title}</h4>
                      <p className="session-edit-subtitle">{currentSession.location} • {currentSession.durationEstimate}</p>
                    </div>
                    <button 
                      type="button" 
                      className="btn-add-ex"
                      onClick={handleAddExerciseToEditing}
                    >
                      <Plus size={14} /> Add Exercise
                    </button>
                  </div>

                  <div className="exercises-edit-list">
                    {currentSession.exercises.length === 0 ? (
                      <div className="empty-exercises-notice">
                        No exercises in this session. Tap "+ Add Exercise" above.
                      </div>
                    ) : (
                      currentSession.exercises.map((ex, idx) => (
                        <div key={ex.id} className="exercise-edit-row">
                          <div className="ex-edit-number">{idx + 1}</div>
                          <div className="ex-edit-fields">
                            <input 
                              type="text" 
                              className="ex-name-input"
                              value={ex.name}
                              onChange={(e) => {
                                ex.name = e.target.value;
                                setEditingPlan({ ...editingPlan });
                              }}
                              placeholder="Exercise Name"
                            />
                            <div className="ex-inline-configs">
                              <label>
                                Sets:
                                <input 
                                  type="number" 
                                  min="1" 
                                  max="10" 
                                  value={ex.targetSets}
                                  onChange={(e) => {
                                    ex.targetSets = parseInt(e.target.value) || 1;
                                    setEditingPlan({ ...editingPlan });
                                  }}
                                />
                              </label>
                              <label>
                                Reps/Time:
                                <input 
                                  type="text" 
                                  value={ex.targetReps}
                                  onChange={(e) => {
                                    ex.targetReps = e.target.value;
                                    setEditingPlan({ ...editingPlan });
                                  }}
                                  placeholder="e.g. 10 reps"
                                />
                              </label>
                              <label>
                                Rest (s):
                                <input 
                                  type="number" 
                                  step="15" 
                                  min="0"
                                  value={ex.defaultRestSec}
                                  onChange={(e) => {
                                    ex.defaultRestSec = parseInt(e.target.value) || 0;
                                    setEditingPlan({ ...editingPlan });
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                          <button 
                            type="button"
                            className="btn-delete-ex"
                            onClick={() => handleRemoveExerciseFromEditing(ex.id)}
                            title="Remove exercise"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Bottom Save Button */}
            <div className="edit-bottom-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => {
                  setViewMode('list');
                  setEditingPlan(null);
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-save-plan"
                onClick={handleSaveEdit}
              >
                Save Workout Plan
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW MODE: IMPORT JSON
            ======================================================== */}
        {viewMode === 'import' && (
          <div className="plan-import-container">
            <div className="import-instructions">
              <p>Paste a workout plan JSON object or upload a `.json` file. The plan must contain a <code>name</code> and a <code>days</code> array.</p>
            </div>

            <div className="file-upload-row">
              <label className="btn-file-upload">
                <Upload size={16} />
                <span>Upload .json File</span>
                <input 
                  type="file" 
                  accept=".json,application/json" 
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>

              <a
                href="./plan.example.json"
                download="plan.example.json"
                className="btn-file-upload"
                style={{ textDecoration: 'none' }}
                title="Download plan.example.json template"
              >
                <Download size={16} />
                <span>Download .example Template</span>
              </a>
            </div>

            {importError && (
              <div className="import-error-banner">
                <AlertCircle size={16} />
                <span>{importError}</span>
              </div>
            )}

            <textarea 
              className="import-textarea"
              rows={12}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder={`{\n  "name": "Phase 2: Hypertrophy Split",\n  "focusTag": "Strength",\n  "days": [\n    {\n      "dayId": "monday",\n      "dayName": "Monday",\n      "shortName": "Mon",\n      "morning": { ... },\n      "evening": { ... }\n    }\n  ]\n}`}
            />

            <div className="edit-bottom-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => {
                  setViewMode('list');
                  setImportError('');
                }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-save-plan"
                onClick={handleImportSubmit}
              >
                Validate & Import Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
