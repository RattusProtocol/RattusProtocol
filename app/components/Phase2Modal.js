import { Dialog } from '@headlessui/react';

export default function Phase2Modal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl rounded bg-gray-900 p-6 text-white border border-red-500">
          <Dialog.Title className="text-2xl font-bold mb-4 text-red-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.96-.474-2.58-1.219l-.549-.547z" />
            </svg>
            Phase 2: Battle Arena
          </Dialog.Title>
          
          <div className="space-y-4">
            <div className="bg-red-900/20 p-4 rounded border border-red-800">
              <h3 className="text-lg font-semibold text-red-300 mb-2">Unlock Conditions</h3>
              <ul className="list-disc pl-5 text-gray-300">
                <li>All Phase 1 rats must unlock most of their complete ability set</li>
                <li>Market cap must reach predetermined threshold (subject to change based on market demand)</li>
                <li>Period of 30 minutes (subject to change based on market demand)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-red-300 mb-2">Battle Arena</h3>
              <p className="text-gray-300">
                Once Phase 2 begins, all enhanced rats will enter a life-or-death arena battle. 
                Only the three strongest specimens will survive, proving the superiority of their compounds.
              </p>
            </div>

            <div className="bg-purple-900/20 p-4 rounded border border-purple-800">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Wagering System</h3>
              <p className="text-gray-300">
                Before the battle begins, holders will be able to place wagers using the official token:
              </p>
              <ul className="list-disc pl-5 mt-2 text-gray-300">
                <li>Select your champion rat(s)</li>
                <li>Place wagers using the official token</li>
                <li>Winners split the prize pool based on their wager percentage</li>
                <li>5% of the prize pool will be burnt</li>
              </ul>
            </div>

            <div className="bg-green-900/20 p-4 rounded border border-green-800">
              <h3 className="text-lg font-semibold text-green-300 mb-2">Next Experiment Round</h3>
              <p className="text-gray-300">
                After the battle concludes, a new experimental phase begins:
              </p>
              <ul className="list-disc pl-5 mt-2 text-gray-300">
                <li>The three surviving champions unlock access to enhanced abilities</li>
                <li>Currently inactive subjects join the experiment with their unique abilities:</li>
                <ul className="list-disc pl-5 mt-1 text-gray-300">
                  <li>T-Virus - Zombie mutation and viral spread abilities</li>
                  <li>Extremis Virus - Regeneration and thermal manipulation</li>
                  <li>Plasmid - Genetic modification and elemental powers</li>
                  <li>Gamma Radiation - Hulk-like strength and rage abilities</li>
                  <li>Mirakuru - Enhanced strength and rapid cellular regeneration</li>
                  <li>OZ Formula - Goblin-like strength and advanced intelligence</li>
                  <li>And more to be revealed...</li>
                </ul>
                <li>New compound combinations and mutation paths become available</li>
                <li>Higher market cap thresholds unlock more powerful transformations</li>
              </ul>
            </div>

            <div className="mt-4 text-sm text-gray-400 italic">
              * Phase 2 details subject to community governance and final implementation
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 