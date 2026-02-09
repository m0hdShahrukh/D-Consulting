import { __ } from '@wordpress/i18n';
import { useBuilderStore } from '../../store';

const BuilderTopbar = () => {
  const { device, setDevice, undo, redo, canUndo, canRedo } = useBuilderStore();

  return (
    <header className="builder-topbar">
      <div className="builder-topbar__brand">
        <span className="builder-topbar__logo">DCRB</span>
        <div>
          <strong>{__('React Page Builder', 'd-consulting-react-builder')}</strong>
          <p>{__('Drag widgets into the canvas to build layouts.', 'd-consulting-react-builder')}</p>
        </div>
      </div>
      <div className="builder-topbar__actions">
        <div className="builder-topbar__devices">
          {['desktop', 'tablet', 'mobile'].map((mode) => (
            <button
              key={mode}
              type="button"
              className={device === mode ? 'is-active' : ''}
              onClick={() => setDevice(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="builder-topbar__history">
          <button type="button" onClick={undo} disabled={!canUndo}>
            {__('Undo', 'd-consulting-react-builder')}
          </button>
          <button type="button" onClick={redo} disabled={!canRedo}>
            {__('Redo', 'd-consulting-react-builder')}
          </button>
        </div>
        <button type="button" className="builder-topbar__primary">
          {__('Publish', 'd-consulting-react-builder')}
        </button>
      </div>
    </header>
  );
};

export default BuilderTopbar;
