import React from 'react';
import { Icon } from '@patternfly/react-core';

import {
  SeverityCriticalIcon,
  SeverityMinorIcon,
  SeverityModerateIcon,
  SeverityUndefinedIcon,
} from '@patternfly/react-icons';

export const HighSeverity = () => (
  <>
    <Icon style={{ '--pf-v6-c-icon__content--Color': 'var(--pf-t--global--icon--color--severity--critical--default)' }} className="pf-v6-u-mr-xs" isInline>
      <SeverityCriticalIcon />
    </Icon>
    High
  </>
);

export const MediumSeverity = () => (
  <>
    <Icon style={{ '--pf-v6-c-icon__content--Color': 'var(--pf-t--global--icon--color--severity--moderate--default)' }} className="pf-v6-u-mr-xs" isInline>
      <SeverityModerateIcon />
    </Icon>
    Medium
  </>
);

export const LowSeverity = () => (
  <>
    <Icon style={{ '--pf-v6-c-icon__content--Color': 'var(--pf-t--global--icon--color--severity--minor--default)' }} className="pf-v6-u-mr-xs minor" isInline>
      <SeverityMinorIcon />
    </Icon>
    Low
  </>
);

export const UnknownSeverity = () => (
  <>
    <Icon style={{ '--pf-v6-c-icon__content--Color': 'var(--pf-t--global--icon--color--severity--undefined--default)' }} className="pf-v6-u-mr-xs undefined" isInline>
      <SeverityUndefinedIcon />
    </Icon>
    Unknown
  </>
);
