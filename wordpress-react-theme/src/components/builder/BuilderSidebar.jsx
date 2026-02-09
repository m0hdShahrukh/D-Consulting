import { __ } from '@wordpress/i18n';
import { widgetLibrary } from '../../data/widgets';
import { useBuilderStore } from '../../store';

const BuilderSidebar = () => {
  const { addWidget } = useBuilderStore();

  return (
    <aside className="builder-sidebar">
      <div className="builder-sidebar__header">
        <h2>{__('Widgets', 'd-consulting-react-builder')}</h2>
        <p>{__('Click to add a widget to the selected section.', 'd-consulting-react-builder')}</p>
      </div>
      <div className="builder-sidebar__grid">
        {widgetLibrary.map((widget) => (
          <button
            key={widget.key}
            type="button"
            className="builder-widget-card"
            onClick={() => addWidget(widget)}
          >
            <span className="builder-widget-card__title">{widget.label}</span>
            <span className="builder-widget-card__meta">{widget.category}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default BuilderSidebar;
