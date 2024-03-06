/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { NavigationPublicPluginStart } from '../../../../../src/plugins/navigation/public';
import { CoreStart, ChromeBreadcrumb, MountPoint } from '../../../../../src/core/public';
import '../../ace-themes/sql_console';
import { CreateIndex } from './create_index';
import { SearchResult } from './search_result';
import { useSearchRelevanceContext } from '../../contexts';
import { DocumentsIndex } from '../../types/index';
import { ServiceEndpoints } from '../../../common';
import { Flyout } from '../common/flyout';

import './home.scss';
import { DataSourceManagementPluginSetup } from '../../../../../src/plugins/data_source_management/public';

interface QueryExplorerProps {
  parentBreadCrumbs: ChromeBreadcrumb[];
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
  setBreadcrumbs: (newBreadcrumbs: ChromeBreadcrumb[]) => void;
  setToast: (title: string, color?: string, text?: any, side?: string) => void;
  chrome: CoreStart['chrome'];
  dataSourceManagement: DataSourceManagementPluginSetup;
  savedObjects: CoreStart['savedObjects'];
  setActionMenu: (menuMount: MountPoint | undefined) => void;
}
export const Home = ({
  parentBreadCrumbs,
  notifications,
  http,
  navigation,
  setBreadcrumbs,
  setToast,
  chrome,
  dataSourceManagement,
  savedObjects,
  setActionMenu,
}: QueryExplorerProps) => {
  const {
    documentsIndexes1,
    setDocumentsIndexes1,
    documentsIndexes2,
    setDocumentsIndexes2,
    pipelines1,
    setPipelines1,
    pipelines2,
    setPipelines2,
    showFlyout,
    selectedDataSource1,
    selectedDataSource2,
  } = useSearchRelevanceContext();

  useEffect(() => {
    setBreadcrumbs([...parentBreadCrumbs]);
  }, [setBreadcrumbs, parentBreadCrumbs]);

  // Get Indexes and Pipelines
  useEffect(() => {
    http.get(ServiceEndpoints.GetIndexes).then((res: DocumentsIndex[]) => {
      setDocumentsIndexes1(res);
    });

    http.get(ServiceEndpoints.GetIndexes).then((res: DocumentsIndex[]) => {
      setDocumentsIndexes2(res);
    });

    http.get(ServiceEndpoints.GetPipelines).then((res: {}) => {
      setPipelines1(res);
    });

    http.get(ServiceEndpoints.GetPipelines).then((res: {}) => {
      setPipelines2(res);
    });
  }, [http, setDocumentsIndexes1, setDocumentsIndexes2, setPipelines1, setPipelines2]);
  return (
    <>
    <navigation.ui.TopNavMenu
    appName={'searchRelevance'}
    setMenuMountPoint={setActionMenu}
    showSearchBar={true}
    showFilterBar={false}
    showDatePicker={false}
    showQueryBar={false}
    showSaveQuery={false}
    showQueryInput={false}
    showDataSourcePicker={true}
    dataSourceCallBackFunc={(id) => console.log(id)}
    disableDataSourcePicker={false}
  />
      <div className="osdOverviewWrapper">
        {documentsIndexes1.length || documentsIndexes2.length ? <SearchResult http={http} dataSourceManagement={dataSourceManagement} savedObjects={savedObjects} notifications={notifications} navigation={navigation} setActionMenu={setActionMenu}/> : <CreateIndex />}
      </div>
      {showFlyout && <Flyout />}
    </>
  );
};
