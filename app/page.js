import ExperimentLab from './components/ExperimentLab';
import Header from './components/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0014]">
      <Header />
      <ExperimentLab />
    </main>
  );
}
