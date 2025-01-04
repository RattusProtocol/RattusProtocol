'use client'
import { useState, useEffect } from 'react';
import CompoundSynthesisModal from './CompoundSynthesisModal';
import GeneticAnalysisModal from './GeneticAnalysisModal';
import QuantumAnalysisModal from './QuantumAnalysisModal';
import BehavioralMatrixModal from './BehavioralMatrixModal';

export default function AnalysisButtons() {
  const [activeModal, setActiveModal] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      const modalContent = document.querySelector('.modal-content');
      if (modalContent && !modalContent.contains(event.target)) {
        setActiveModal(null);
      }
    }

    if (activeModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeModal]);

  const buttons = [
    {
      id: 'compound',
      title: 'COMPOUND_SYNTHESIS',
      description: 'Molecular binding analysis and reaction kinetics',
      modal: <CompoundSynthesisModal isOpen={activeModal === 'compound'} onClose={() => setActiveModal(null)} />
    },
    {
      id: 'genetic',
      title: 'GENETIC_ANALYSIS',
      description: 'DNA sequencing and mutation tracking',
      modal: <GeneticAnalysisModal isOpen={activeModal === 'genetic'} onClose={() => setActiveModal(null)} />
    },
    {
      id: 'quantum',
      title: 'QUANTUM_ANALYSIS',
      description: 'Neural pathway quantum state observation',
      modal: <QuantumAnalysisModal isOpen={activeModal === 'quantum'} onClose={() => setActiveModal(null)} />
    },
    {
      id: 'behavioral',
      title: 'BEHAVIORAL_MATRIX',
      description: 'Synaptic response pattern recognition',
      modal: <BehavioralMatrixModal isOpen={activeModal === 'behavioral'} onClose={() => setActiveModal(null)} />
    }
  ];

  return (
    <>
      <div className="grid grid-cols-4 gap-3 p-3">
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => setActiveModal(button.id)}
            onMouseEnter={() => setHoveredButton(button.id)}
            onMouseLeave={() => setHoveredButton(null)}
            className={`bg-[#1a0033]/80 p-3 rounded-lg border border-purple-700/20 
                     shadow-[0_0_30px_rgba(88,28,135,0.2),inset_0_0_20px_rgba(88,28,135,0.2)]
                     hover:bg-[#2a0044] hover:border-purple-500/40 
                     hover:shadow-[0_0_40px_rgba(88,28,135,0.3),inset_0_0_30px_rgba(88,28,135,0.3)]
                     active:bg-[#3a0055] active:scale-[0.99]
                     transition-all duration-200 group cursor-pointer relative`}
          >
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 
                          rounded-lg transition-opacity duration-200" />
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-1 h-1 ${hoveredButton === button.id ? 'bg-purple-400' : 'bg-purple-700'} 
                            group-hover:bg-purple-500 group-hover:w-2 group-hover:h-2 
                            transition-all duration-200`} />
              <h3 className="text-sm text-purple-400 font-mono tracking-wider group-hover:text-purple-300 
                           transition-colors">
                [{button.title}]
              </h3>
            </div>
            <p className="text-purple-300/70 text-xs font-mono pl-3">
              {button.description}
            </p>
          </button>
        ))}
      </div>

      {/* Render active modal */}
      {buttons.map((button) => (
        activeModal === button.id && (
          <div key={`modal-${button.id}`} className="modal-wrapper">
            {button.modal}
          </div>
        )
      ))}
    </>
  );
} 