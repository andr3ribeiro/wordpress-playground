import { useEffect } from 'react';
import type { GitHubImportFormProps } from './form';
import GitHubImportForm from './form';
import { usePlaygroundClient } from '../../lib/use-playground-client';
import { setActiveModal } from '../../lib/state/redux/slice-ui';
import type { PlaygroundDispatch } from '../../lib/state/redux/store';
import {
	useAppSelector,
	useActiveSite,
	useAppDispatch,
	setActiveSite,
} from '../../lib/state/redux/store';
import { selectTemporarySite } from '../../lib/state/redux/slice-sites';
import { useDispatch } from 'react-redux';
import { Modal } from '../../components/modal';
import { Spinner } from '@wordpress/components';
import { PlaygroundRoute, redirectTo } from '../../lib/state/url/router';

interface GithubImportModalProps {
	defaultOpen?: boolean;
	onImported?: GitHubImportFormProps['onImported'];
}
export function GithubImportModal({
	defaultOpen,
	onImported,
}: GithubImportModalProps) {
	const dispatch: PlaygroundDispatch = useDispatch();
	const appDispatch = useAppDispatch();
	const playground = usePlaygroundClient();
	const activeSite = useActiveSite();
	const temporarySite = useAppSelector(selectTemporarySite);

	// Ensure we're importing into a temporary site, not a saved site.
	// If the active site is saved, switch to or create a temporary site.
	const isSavedSite = activeSite && activeSite.metadata.storage !== 'none';

	useEffect(() => {
		if (!isSavedSite) {
			return;
		}
		if (temporarySite) {
			// Switch to existing temporary site
			appDispatch(setActiveSite(temporarySite.slug));
		} else {
			// No temporary site exists, create one by redirecting
			redirectTo(PlaygroundRoute.newTemporarySite());
			dispatch(setActiveModal(null));
		}
	}, [isSavedSite, temporarySite, appDispatch, dispatch]);

	const closeModal = () => {
		dispatch(setActiveModal(null));
	};

	// Show loading while switching to temporary site
	if (isSavedSite) {
		return (
			<Modal title="Import from GitHub" onRequestClose={closeModal}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '10px',
						padding: '20px',
					}}
				>
					<Spinner />
					<span>Switching to temporary Playground...</span>
				</div>
			</Modal>
		);
	}

	return (
		<Modal title="Import from GitHub" onRequestClose={closeModal}>
			<GitHubImportForm
				playground={playground!}
				onClose={closeModal}
				onImported={(details) => {
					playground!.goTo('/');
					// eslint-disable-next-line no-alert
					alert(
						'Import finished! Your Playground site has been updated.'
					);
					onImported?.(details);
					closeModal();
				}}
			/>
		</Modal>
	);
}
