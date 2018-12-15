import CMS from 'netlify-cms';
import { InlineSelectControl, InlineSelectPreview } from 'netlify-cms-widget-inline-select';

CMS.registerWidget('inline-select', InlineSelectControl, InlineSelectPreview);