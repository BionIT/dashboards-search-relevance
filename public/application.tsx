/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppMountParameters, CoreStart } from '../../../src/core/public';
import { AppPluginStartDependencies } from './types';
import { SearchRelevanceApp } from './components/app';
import { DataSourceManagementPluginSetup } from '../../../src/plugins/data_source_management/public';

export const renderApp = (
  { notifications, http, chrome, savedObjects }: CoreStart,
  { navigation }: AppPluginStartDependencies,
  { element, setHeaderActionMenu }: AppMountParameters,
  dataSourceManagement: DataSourceManagementPluginSetup
) => {
  ReactDOM.render(
    <SearchRelevanceApp
      notifications={notifications}
      http={http}
      navigation={navigation}
      chrome={chrome}
      dataSourceManagement={dataSourceManagement}
      savedObjects={savedObjects}
      setActionMenu={setHeaderActionMenu}
    />,
    element
  );

  return () => ReactDOM.unmountComponentAtNode(element);
};
