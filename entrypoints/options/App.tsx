import { ENABLE_SAMPLES } from '@/constants/flag';
import { OptionsRouter } from './router';
import { DebugPage, SamplePage } from './sample/SamplePage';

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const sampleKey = searchParams.get('sample');

  if (ENABLE_SAMPLES && searchParams.has('samples')) {
    return <DebugPage />;
  }

  if (ENABLE_SAMPLES && sampleKey) {
    return <SamplePage sampleKey={sampleKey} />;
  }

  return <OptionsRouter />;
}

export default App;
