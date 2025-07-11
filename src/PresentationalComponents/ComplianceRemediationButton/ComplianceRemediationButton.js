import React from 'react';
import propTypes from 'prop-types';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import { default as RemediationRemediationButton } from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import { useIssuesFetch } from './hooks';
import FallbackButton from './components/FallBackButton';

const ComplianceRemediationButton = ({
  reportId,
  reportTestResults,
  selectedRuleResultIds,
  onRemediationCreated,
  ...buttonProps
}) => {
  const addNotification = useAddNotification();
  const { isLoading: isLoadingIssues, fetch } = useIssuesFetch(
    reportId,
    reportTestResults,
    selectedRuleResultIds,
  );

  return (
    <RemediationRemediationButton
      isDisabled={reportTestResults?.length === 0 || isLoadingIssues}
      onRemediationCreated={(result) => {
        addNotification(result.getNotification());
      }}
      dataProvider={fetch}
      buttonProps={{
        ouiaId: 'RemediateButton',
        isLoading: isLoadingIssues,
      }}
      fallback={<FallbackButton />}
      {...buttonProps}
    >
      Plan remediation
    </RemediationRemediationButton>
  );
};

ComplianceRemediationButton.propTypes = {
  reportId: propTypes.string,
  reportTestResults: propTypes.arrayOf(propTypes.object),
  selectedRuleResultIds: propTypes.arrayOf(propTypes.string),
  onRemediationCreated: propTypes.func,
};

export default ComplianceRemediationButton;
