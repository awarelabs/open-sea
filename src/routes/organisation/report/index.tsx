import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../../components/Redirect';
import { Route } from '../../../components/Route';
import collection from '../../../stores/collection';
import OrganisationReportModel from './model';
import OrganisationReportOverview from './Report';
import OrganisationReportSettings from './settings';
import OrganisationReportSurveys from './surveys';

const OrganisationReportRoutes = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId, repId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.findById(orgId);

	if (!organisation) return <Redirect to="/dashboard/organisations" />;

	const report = collection(organisation._reports).findById(`${orgId}/${repId}`);
	if (!report) return <Redirect to={`/${orgId}/reports`} />;

	return (
		<Switch>
			<Route path="/:orgId/:repId" exact component={OrganisationReportOverview} />
			<Route path="/:orgId/:repId/model" exact component={OrganisationReportModel} />
			<Route path="/:orgId/:repId/settings" exact component={OrganisationReportSettings} />
			<Route path="/:orgId/:repId/surveys" exact component={OrganisationReportSurveys} />
		</Switch>
	);
}));

export default OrganisationReportRoutes;
