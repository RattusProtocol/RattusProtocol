import { Dialog } from '@headlessui/react';

export default function HowItWorksModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl rounded bg-gray-900 p-6 text-white border border-purple-500">
          <Dialog.Title className="text-2xl font-bold mb-4 text-purple-400">
            How It Works
          </Dialog.Title>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Unique Approach</h3>
              <p className="text-gray-300">
                Unlike traditional experiments that use mundane real-world compounds, our lab harnesses the power 
                of legendary substances from sci-fi and fantasy universes. From Marvel's Super Soldier Serum to 
                The Witcher's Trial of the Grasses, we're pushing the boundaries of what's possible in genetic experimentation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Market-Driven Evolution</h3>
              <p className="text-gray-300">
                The experiment monitors the token's market cap in real-time, triggering mutations and unlocking 
                abilities as milestones are reached.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Sci-Fi Compounds</h3>
              <p className="text-gray-300">
                Each rat is injected with iconic compounds that grant extraordinary abilities:
              </p>
              <ul className="list-disc pl-5 mt-2 text-gray-300">
                <li>Compound V - Unleash laser beams and elemental powers</li>
                <li>Venom Symbiote - Master web-slinging and symbiote abilities</li>
                <li>Titan Serum - Transform into colossal beings</li>
                <li>The Grasses - Harness the power of Witcher signs</li>
                <li>Polyjuice Potion - Shape-shift into other experimental subjects</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Advanced Analysis</h3>
              <p className="text-gray-300">
                Monitor quantum states, genetic mutations, and behavioral patterns as your rats evolve 
                with their newfound powers. Each compound creates unique transformation effects and 
                interaction patterns.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 