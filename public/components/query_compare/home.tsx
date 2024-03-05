/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { NavigationPublicPluginStart } from '../../../../../src/plugins/navigation/public';
import { CoreStart, ChromeBreadcrumb } from '../../../../../src/core/public';
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
}: QueryExplorerProps) => {
  const {
    documentsIndexes,
    setDocumentsIndexes,
    pipelines,
    setPipelines,
    showFlyout,
  } = useSearchRelevanceContext();

  useEffect(() => {
    setBreadcrumbs([...parentBreadCrumbs]);
  }, [setBreadcrumbs, parentBreadCrumbs]);

  // Get Indexes and Pipelines
  useEffect(() => {
    http.get(ServiceEndpoints.GetIndexes).then((res: DocumentsIndex[]) => {
      setDocumentsIndexes(res);
    });

    http.get(ServiceEndpoints.GetPipelines).then((res: {}) => {
      setPipelines(res);
    });
  }, [http, setDocumentsIndexes, setPipelines]);
  return (
    <>
      <div className="osdOverviewWrapper">
        {documentsIndexes.length ? <SearchResult http={http} dataSourceManagement={dataSourceManagement}/> : <CreateIndex />}
      </div>
      {showFlyout && <Flyout />}
    </>
  );
};
