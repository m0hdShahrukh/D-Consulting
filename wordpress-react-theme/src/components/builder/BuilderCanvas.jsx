import { __ } from '@wordpress/i18n';
import { useBuilderStore } from '../../store';

const BuilderCanvas = () => {
  const { sections, selectedSectionId, selectSection, device } = useBuilderStore();

  return (
    <section className={`builder-canvas is-${device}`}>
      <header className="builder-canvas__header">
        <h2>{__('Canvas', 'd-consulting-react-builder')}</h2>
        <span>{__('Drop widgets into sections to build your layout.', 'd-consulting-react-builder')}</span>
      </header>
      <div className="builder-canvas__sections">
        {sections.map((section) => (
          <article
            key={section.id}
            className={`builder-section ${selectedSectionId === section.id ? 'is-selected' : ''}`}
            onClick={() => selectSection(section.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                selectSection(section.id);
              }
            }}
          >
            <div className="builder-section__header">
              <strong>{section.name}</strong>
              <span>{section.widgets.length} {__('widgets', 'd-consulting-react-builder')}</span>
            </div>
            <div className="builder-section__grid">
              {section.widgets.length === 0 ? (
                <p className="builder-section__empty">
                  {__('Select a widget from the sidebar to start.', 'd-consulting-react-builder')}
                </p>
              ) : (
                section.widgets.map((widget) => (
                  <div key={widget.instanceId} className="builder-widget">
                    <span>{widget.label}</span>
                    <small>{widget.category}</small>
                  </div>
                ))
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BuilderCanvas;
