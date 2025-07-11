import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import FilterBuilder from './FilterBuilder';
import ChipBuilder from './ChipBuilder';
import { stringToId } from './Helpers';

const defaultPlaceholder = (label) => `Filter by ${label.toLowerCase()}`;

class FilterConfigBuilder {
  chipBuilder = null;
  filterBuilder = null;

  constructor(config) {
    this.config = config;
  }

  addConfigItem = (item) =>
    (this.config = this.config
      .filter((i) => i.label !== item.label)
      .concat(item));

  getChipBuilder = (config) => {
    if (config) {
      this.config = config;
    }

    return (this.chipBuilder = this.chipBuilder
      ? this.chipBuilder
      : new ChipBuilder(this));
  };

  getFilterBuilder = (config) => {
    if (config) {
      this.config = config;
    }

    return (this.filterBuilder = this.filterBuilder
      ? this.filterBuilder
      : new FilterBuilder(this));
  };

  toTextFilterConfig = (item, handler, value) => ({
    type: conditionalFilterType.text,
    label: item.label,
    placeholder: defaultPlaceholder(item.label),
    id: stringToId(item.label),
    filterValues: {
      value,
      [item.event || 'onChange']: (_event, selectedValues) => {
        handler(stringToId(item.label), selectedValues);
      },
    },
  });

  toCheckboxFilterConfig = (item, handler, value) => ({
    type: conditionalFilterType.checkbox,
    label: item.label,
    placeholder: defaultPlaceholder(item.label),
    id: stringToId(item.label),
    filterValues: {
      value,
      items: item.items,
      onChange: (_event, selectedValues) => {
        handler(stringToId(item.label), selectedValues);
      },
    },
  });

  toRadioFilterConfig = (item, handler, value) => ({
    type: conditionalFilterType.radio,
    label: item.label,
    placeholder: defaultPlaceholder(item.label),
    id: stringToId(item.label),
    filterValues: {
      value,
      items: item.items,
      onChange: (_event, selectedValues) => {
        handler(stringToId(item.label), selectedValues);
      },
    },
  });

  toGroupedFilterConfig = (item, handler, value) => ({
    type: conditionalFilterType.group,
    label: item.label,
    id: stringToId(item.label),
    className: item.className,
    filterValues: {
      selected: value,
      onChange: (_event, selectedValues) => {
        handler(stringToId(item.label), selectedValues);
      },
      groups: item.items.map((item) => ({
        ...item,
        type: 'checkbox',
        items: item.items.map((subItem) => ({
          ...subItem,
          type: 'checkbox',
        })),
      })),
    },
  });

  toFilterConfigItem = (item, handler, value) => {
    switch (item.type) {
      case conditionalFilterType.text:
        return this.toTextFilterConfig(item, handler, value);

      case conditionalFilterType.checkbox:
        return this.toCheckboxFilterConfig(item, handler, value);

      case conditionalFilterType.radio:
        return this.toRadioFilterConfig(item, handler, value);

      case conditionalFilterType.group:
        return this.toGroupedFilterConfig(item, handler, value);

      default:
        return null;
    }
  };

  buildConfiguration = (handler, states, props = {}, initConfig) => ({
    ...props,
    items: (initConfig || this.config)
      .map((item) =>
        this.toFilterConfigItem(item, handler, states[stringToId(item.label)]),
      )
      .filter((v) => !!v),
  });

  defaultValueForFilter = (filter) => {
    switch (filter.type) {
      case conditionalFilterType.text:
        return '';
      case conditionalFilterType.checkbox:
        return [];
      case 'hidden':
        return filter.default || false;
      default:
        return;
    }
  };

  initialDefaultState = (defaultStates = {}, initConfig) =>
    (initConfig || this.config).reduce((acc, filter) => {
      const filterStateName = stringToId(filter.key || filter.label);
      const state =
        defaultStates[filterStateName] || this.defaultValueForFilter(filter);
      acc[filterStateName] = typeof state !== 'undefined' ? state : undefined;
      return acc;
    }, {});

  categoryLabelForValue = (value) => {
    const category = this.config.filter((category) =>
      category.items
        ? category.items.map((item) => item.value).includes(value)
        : false,
    )[0];

    return category ? category.label : value;
  };

  getCategoryForLabel = (query) =>
    this.config.filter(
      (item) => stringToId(item.key || item.label) === stringToId(query),
    )[0] || {};

  getItemByLabelOrValue = (query, category) => {
    const categoryConfig = this.getCategoryForLabel(category);
    const items =
      categoryConfig.type !== conditionalFilterType.group
        ? categoryConfig.items
        : categoryConfig.items.flatMap((item) =>
            item.items.map((subItem) => ({
              ...subItem,
              parentValue: item.value,
            })),
          );
    const results = (items || []).filter(
      (item) => item.value === query || item.label === query,
    );

    if (results.length === 1) {
      return results[0];
    } else if (results.length > 1) {
      console.info(
        `Multiple items found for ${query} in ${category}! Returning first one.`,
      );
      return results[0];
    } else {
      console.info('No item found for ' + query + ' in ', category);
    }
  };

  labelForValue = (value, category) => {
    const item = this.getItemByLabelOrValue(value, category);
    return item ? item.label : value;
  };

  valueForLabel = (label, category) => {
    const item = this.getItemByLabelOrValue(label, category);
    return item ? item.value : label;
  };

  applyFilterToObjectArray = (objects, activeFilters) => {
    let filteredObjects = [...objects];

    Object.keys(activeFilters).forEach((filter) => {
      const category = this.getCategoryForLabel(filter);
      const value = activeFilters[filter];
      if (!category || !value) {
        return;
      }

      if (
        value.length > 0 ||
        (category.type === 'hidden' && typeof value === 'boolean')
      ) {
        filteredObjects = category.filter(filteredObjects, value);
      }
    });

    return filteredObjects;
  };

  removeFilterFromFilterState = (currentState, filter) =>
    typeof currentState === 'string'
      ? ''
      : currentState.filter((value) => value !== filter);

  removeFilterFromGroupFilterState = (currentState, filter, chipItem) => {
    // eslint-disable-next-line
        const { [chipItem.value]: _remove, ...newGroupState } = currentState[chipItem.parentValue];
    return {
      ...currentState,
      [chipItem.parentValue]: newGroupState,
    };
  };

  removeFilterWithChip = (chips, activeFilters) => {
    const chipCategory = chips.category;
    const chipLabel = chips.chips[0].name;
    const chipItem = this.getItemByLabelOrValue(chipLabel, chipCategory);
    const chipValue = chipItem ? chipItem.value : chipLabel;
    const stateProp = stringToId(chipCategory);
    const currentState = activeFilters[stateProp];
    const categoryConfig = this.getCategoryForLabel(chipCategory);
    const isGroup = categoryConfig.type === conditionalFilterType.group;
    const newFilterState = (
      isGroup
        ? this.removeFilterFromGroupFilterState
        : this.removeFilterFromFilterState
    )(currentState, chipValue, chipItem);

    return {
      ...activeFilters,
      [stateProp]: newFilterState,
    };
  };
}

export default FilterConfigBuilder;
