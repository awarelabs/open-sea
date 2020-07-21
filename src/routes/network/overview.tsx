import { filter, get, inRange, isUndefined, last, map } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { LinkButton } from '../../components/Button';
import Container from '../../components/Container';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import { Link } from '../../components/Link';
import { Lozenge } from '../../components/Lozenge';
import { Section } from '../../components/Section';
import OrganisationGrid, { UserGridItem as OrganisationGridItem } from '../../components/UserGrid';
import { getCurrentUserAccess } from '../../stores/helpers';

const NetworkOverview = inject(app('OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { match: { params: { netId } }, OrganisationsStore, ReportsStore, state } = props;
	const network = OrganisationsStore.findById(netId) || {};
	const organisations = network._organisations;
	const model = get(network, 'model');
	const certifications = get(model, 'certifications');
	const indicators = get(model, 'indicators');
	const currentUserAccess = getCurrentUserAccess(state, network);

	const PageHead = (
		<Header
			title="Member overview"
			headTitle={network.name}
			breadcrumbs={[
				<Link key={`/${netId}`} to={`/${netId}`}>{network.name}</Link>
			]}
		/>
	);

	if (!model) return inRange(currentUserAccess, 30, 101) ? <Redirect to={`/${netId}/settings/model`} /> : (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					<EmptyState>
						<img src="/assets/images/empty-state-welcome.svg" />
						<h1>Insufficient permissions</h1>
						<p>
							openESEA requires a model to be set for this network, however you do not have
							the required access level to do so. Please contact the owner or one of the
							administrators to fix this.
						</p>
					</EmptyState>
				</Section>
			</Container>
		</React.Fragment>
	);

	if (organisations.length === 0) return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					{ inRange(currentUserAccess, 30, 101) ? (
						<EmptyState>
							<img src="/assets/images/empty-state-welcome.svg" />
							<h1>Let's begin</h1>
							<p>
								To get started using openESEA for your network, add an organisation.
							</p>
							<p>
								<LinkButton appearance="default" to={`/${netId}/settings/organisations`}>Manage organisations</LinkButton>
							</p>
						</EmptyState>
					) : (
						<EmptyState>
							<img src="/assets/images/empty-state-welcome.svg" />
							<h1>Welcome to openESEA networks</h1>
							<p>
								To get started, at least one organisation within this network is required, however you do not have
								the required access level to add one. Please contact the owner or one of the administrators to fix this.
							</p>
						</EmptyState>
					) }
				</Section>
			</Container>
		</React.Fragment>
	);

	return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					<OrganisationGrid>
						{map(organisations, ({ _id }) => {
							const organisation = OrganisationsStore.findById(_id);

							return (
								<OrganisationGridItem
									appearance="subtle"
									key={_id}
									to={`/${_id}`}
								>
									<img src={organisation.avatar} />
									<span>{organisation.name}</span>
								</OrganisationGridItem>
							);
						})}
					</OrganisationGrid>
				</Section>
			</Container>
		</React.Fragment>
	);
}));

export default NetworkOverview;
