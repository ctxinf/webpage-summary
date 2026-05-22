import { FlaskConical } from 'lucide-react';
import { ENABLE_SAMPLES } from '@/constants/flag';
import { OptionsRouter } from './router';
import { SamplePage, SamplesNavPage } from './sample/SamplePage';

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const sampleKey = searchParams.get('sample');

  if (ENABLE_SAMPLES && searchParams.has('samples')) {
    return <SamplesNavPage />;
  }

  if (ENABLE_SAMPLES && sampleKey) {
    return <SamplePage sampleKey={sampleKey} />;
  }

  return (
    <>
      {ENABLE_SAMPLES ? (
        <a
          className="fixed right-4 top-4 z-10 inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-[13px] font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          href="?samples=1"
        >
          <FlaskConical size={16} />
          Samples
        </a>
      ) : null}
      <OptionsRouter />
    </>
  );
}

export default App;
