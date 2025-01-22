import useBatchedRuleResults from './fetchBatchedRuleResults';

const useRuleResultsData = ({
  testResultId,
  reportId,
  tableState: {
    // tableState: { tableView } = {},
    serialisedTableState: { filters, pagination, sort } = {},
  } = {},
}) => {
  const ruleResultParams = {
    testResultId,
    reportId,
    limit: pagination?.limit || 10,
    offset: pagination?.offset || 0,
    sortBy: sort || 'title:asc',
    filter: filters,
  };

  const {
    data: ruleResults,
    loading: ruleResultsLoading,
    error: ruleResultsError,
    fetchBatched: fetchBatchedRuleResults,
  } = useBatchedRuleResults({
    params: ruleResultParams,
    skip: false,
    batched: false,
  });

  return {
    loading: ruleResultsLoading,
    error: ruleResultsError,
    data: {
      ruleResults: ruleResults,
    },
    fetchBatchedRuleResults: fetchBatchedRuleResults,
  };
};

export default useRuleResultsData;
