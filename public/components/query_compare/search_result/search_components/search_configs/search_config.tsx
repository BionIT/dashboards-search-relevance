/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { FunctionComponent } from 'react';
import {
  EuiTitle,
  EuiSpacer,
  EuiFormRow,
  EuiSelect,
  EuiCodeEditor,
  EuiText,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiComboBox,
} from '@elastic/eui';

import { useSearchRelevanceContext } from '../../../../../contexts';
import { QueryError, QueryStringError, SelectIndexError } from '../../../../../types/index';
import { DataSourceManagementPluginSetup } from '../../../../../../../../src/plugins/data_source_management/public';
import { AppMountParameters, CoreStart, MountPoint, ToastsStart } from '../../../../../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../../../../../src/plugins/navigation/public';

export interface SearchRelevanceServices extends CoreStart {
  setHeaderActionMenu: AppMountParameters['setHeaderActionMenu'];
  appBasePath: AppMountParameters['history'];
  element: AppMountParameters['element'];
  navigation: NavigationPublicPluginStart;
  toastNotifications: ToastsStart;
  history: AppMountParameters['history'];
  overlays: CoreStart['overlays'];
  chrome: CoreStart['chrome'];
  uiSettings: CoreStart['uiSettings'];
}

interface SearchConfigProps {
  queryNumber: 1 | 2;
  queryString: string;
  setQueryString: React.Dispatch<React.SetStateAction<string>>;
  selectedIndex: string;
  setSelectedIndex: React.Dispatch<React.SetStateAction<string>>;
  queryError: QueryError;
  setQueryError: React.Dispatch<React.SetStateAction<QueryError>>;
  pipeline: string;
  setPipeline: React.Dispatch<React.SetStateAction<string>>;
  dataSourceManagement: DataSourceManagementPluginSetup;
  setSelectedDataSource: React.Dispatch<React.SetStateAction<string>>; 
  selectedDataSource: string;
  savedObjects: CoreStart['savedObjects'];
  notifications: CoreStart['notifications'];
  navigation: NavigationPublicPluginStart;
  setActionMenu: (menuMount: MountPoint | undefined) => void;
}

export const SearchConfig: FunctionComponent<SearchConfigProps> = ({
  queryNumber,
  queryString,
  setQueryString,
  selectedIndex,
  setSelectedIndex,
  queryError,
  setQueryError,
  pipeline,
  setPipeline,
  dataSourceManagement,
  setSelectedDataSource,
  selectedDataSource,
  savedObjects,
  notifications,
  navigation,
  setActionMenu,
}) => {
  const { documentsIndexes1, pipelines1, documentsIndexes2, pipelines2, setShowFlyout } = useSearchRelevanceContext();
  // On select index
  const onChangeSelectedIndex: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSelectedIndex(e.target.value);

    setQueryError((error: QueryError) => ({
      ...error,
      selectIndex: '',
    }));
  };

  const onSelectedDataSource = (e) => {
    console.log("inside selected data source", e)
    const dataSourceId = e[0] ? e[0].id : undefined;
    setSelectedDataSource(dataSourceId);
  }

  // Sort search pipelines based off of each individual pipeline name.
  const sortedPipelines = [...Object.keys(pipelines1)]
    .sort((a, b) => a.localeCompare(b))
    .map((searchPipeline) => ({
      label: searchPipeline,
    }));
  // Add the '_none' option to the pipeline dropdown (runs the index without a pipeline).
  sortedPipelines.push({ label: '_none' });

  // On select pipeline for ComboBox
  const onChangePipeline = (selectedPipelineOptions: string | any[]) => {
    setPipeline(selectedPipelineOptions[0]?.label || '');
  };

  // Select index on blur
  const selectIndexOnBlur = () => {
    // If Index Select on blur without selecting an index, show error
    if (!selectedIndex.length) {
      setQueryError((error: QueryError) => ({
        ...error,
        selectIndex: SelectIndexError.unselected,
      }));
    }
  };

  // On change query string
  const onChangeQueryString = (value: string) => {
    setQueryString(value);
    setQueryError((error: QueryError) => ({
      ...error,
      queryString: '',
    }));
  };

  // Code editor on blur
  const codeEditorOnBlur = () => {
    // If no query string on blur, show error
    if (!queryString.length) {
      setQueryError((error: QueryError) => ({
        ...error,
        errorResponse: {
          body: '',
          statusCode: 400,
        },
        queryString: QueryStringError.empty,
      }));
    }
  };



  return (
    <>
      <EuiTitle size="xs">
        <h2 style={{ fontWeight: '300', fontSize: '21px' }}>Query {queryNumber}</h2>
      </EuiTitle>
      <EuiSpacer size="m" />
      <EuiFlexGroup>
        <EuiFlexItem>
        <EuiFormRow
            fullWidth
            label="Data source"
            error={!!queryError.selectIndex.length && <span>{queryError.selectIndex}</span>}
            isInvalid={!!queryError.selectIndex.length}
          >
            <dataSourceManagement.getDataSourcePicker 
               savedObjectsClient={savedObjects.client}
               notifications={notifications.toasts} 
               onSelectedDataSource={onSelectedDataSource}
               disabled={false} 
               hideLocalCluster={false} 
               fullWidth={false}
              //  removePrepend={true}
              //  compressed={false}
              //  defaultOption={[]}
              //  placeholderText={''}
            />
            </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
          <EuiFormRow
            fullWidth
            label="Index"
            error={!!queryError.selectIndex.length && <span>{queryError.selectIndex}</span>}
            isInvalid={!!queryError.selectIndex.length}
          >
            <EuiSelect
              hasNoInitialSelection={true}
              options={documentsIndexes1.map(({ index }) => ({
                value: index,
                text: index,
              }))}
              aria-label="Search Index"
              onChange={onChangeSelectedIndex}
              value={selectedIndex}
              onBlur={selectIndexOnBlur}
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFormRow fullWidth label="Pipeline" helpText="Optional">
            <EuiComboBox
              placeholder=""
              singleSelection={{ asPlainText: true }}
              options={sortedPipelines}
              selectedOptions={pipeline ? [{ label: pipeline }] : []}
              onChange={onChangePipeline}
            />
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiFormRow
        fullWidth
        label="Query"
        error={!!queryError.queryString.length && <span>{queryError.queryString}</span>}
        isInvalid={!!queryError.queryString.length}
        labelAppend={
          <EuiText size="xs">
            <EuiButtonEmpty size="xs" color="primary" onClick={() => setShowFlyout(true)}>
              Help
            </EuiButtonEmpty>
          </EuiText>
        }
        helpText={
          <p>
            Enter a query in{' '}
            <a href="https://opensearch.org/docs/latest/query-dsl/index/">OpenSearch Query DSL</a>.
            Use %SearchText% to refer to the text in the search bar
          </p>
        }
      >
        <EuiCodeEditor
          mode="json"
          theme="textmate"
          width="100%"
          height="10rem"
          value={queryString}
          onChange={onChangeQueryString}
          showPrintMargin={false}
          setOptions={{
            fontSize: '14px',
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
          }}
          aria-label="Code Editor"
          onBlur={codeEditorOnBlur}
          tabSize={2}
        />
      </EuiFormRow>
    </>
  );
};
