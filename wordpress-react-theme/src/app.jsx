import { __ } from '@wordpress/i18n';
import BuilderCanvas from './components/builder/BuilderCanvas';
import BuilderSidebar from './components/builder/BuilderSidebar';
import BuilderTopbar from './components/builder/BuilderTopbar';

const BuilderApp = () => {
  return (
    <div className="builder-shell">
      <BuilderTopbar />
      <div className="builder-body">
        <BuilderSidebar />
        <BuilderCanvas />
      </div>
      <footer className="builder-footer">
        <span>{__('Draft saved locally', 'd-consulting-react-builder')}</span>
      </footer>
    </div>
  );
};

export default BuilderApp;
