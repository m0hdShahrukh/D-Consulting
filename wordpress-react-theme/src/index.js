import { createRoot } from '@wordpress/element';
import BuilderApp from './app';
import './styles/builder.css';

const container = document.getElementById('dcrb-root');

if (container) {
  const root = createRoot(container);
  root.render(<BuilderApp />);
}
