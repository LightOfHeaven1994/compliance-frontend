import React, { useState } from 'react';
import propTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Button, Checkbox, Content, Spinner } from '@patternfly/react-core';
import { ModalVariant } from '@patternfly/react-core/deprecated';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import {
  ComplianceModal,
  StateViewWithError,
  StateViewPart,
} from 'PresentationalComponents';
import usePolicy from 'Utilities/hooks/api/usePolicy';
import { apiInstance } from 'Utilities/hooks/useQuery';

const DeletePolicy = () => {
  const addNotification = useAddNotification();
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const { policy_id: policyId } = useParams();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('/scappolicies');
  };

  const {
    data: { data: policy } = {},
    loading: loading,
    error: error,
  } = usePolicy({ params: { policyId } });

  const deletePolicy = async (id) => {
    try {
      await apiInstance.deletePolicy(id);
      addNotification({
        variant: 'success',
        title: `Deleted "${policy?.title}" and its associated reports`,
      });
      onClose();
    } catch (e) {
      addNotification({
        variant: 'danger',
        title: 'Error removing policy',
        description: e?.message,
      });
      onClose();
    }
  };

  return (
    <ComplianceModal
      variant={ModalVariant.small}
      title="Delete policy?"
      titleIconVariant="warning"
      ouiaId="DeletePolicyModal"
      isOpen
      onClose={onClose}
      actions={[
        <Button
          key="destroy"
          ouiaId="DeletePolicyButton"
          aria-label="delete"
          isDisabled={!deleteEnabled}
          variant="danger"
          onClick={() => deletePolicy(policy?.id)}
        >
          Delete policy and associated reports
        </Button>,
        <Button
          key="cancel"
          ouiaId="DeletePolicyCancelButton"
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>,
      ]}
    >
      <StateViewWithError stateValues={{ error, data: policy, loading }}>
        <StateViewPart stateKey="loading">
          <Spinner />
        </StateViewPart>
        <StateViewPart stateKey="data">
          <Content component="p" className="policy-delete-body-text">
            Deleting the policy <b>{policy?.title}</b> will also delete its
            associated reports.
          </Content>
          <Checkbox
            label="I understand this will delete the policy and all associated reports"
            id={`deleting-policy-check-${policy?.id}`}
            isChecked={deleteEnabled}
            onChange={(_, v) => setDeleteEnabled(v)}
          />
        </StateViewPart>
      </StateViewWithError>
    </ComplianceModal>
  );
};

DeletePolicy.propTypes = {
  policyId: propTypes.string,
  onClose: propTypes.func,
};

export default DeletePolicy;
