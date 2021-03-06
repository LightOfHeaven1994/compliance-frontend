import { complianceScoreString } from 'PresentationalComponents';
import { profilesRulesFailed } from 'Utilities/ruleHelpers';
import { renderComponent } from 'Utilities/helpers';

import {
    Name as NameCell, ComplianceScore as ComplianceScoreCell, DetailsLink as DetailsLinkCell,
    FailedRules as FailedRulesCell, LastScanned as LastScannedCell, Policies as PoliciesCell,
    SSGVersions as SsgVersionCell, complianceScoreData, lastScanned
} from './Cells';

const disableSorting = { isStatic: true };

export const Name = {
    title: 'Name',
    props: {
        width: 40,
        ...disableSorting
    },
    exportKey: 'name',
    renderExport: (name) => (String(name)),
    renderFunc: renderComponent(NameCell)
};

export const customName = (props) => ({
    ...Name,
    props: {
        ...Name.props,
        ...props
    },
    renderFunc: renderComponent(NameCell, props)
});

export const SsgVersion = {
    title: 'SSG version',
    props: disableSorting,
    exportKey: 'testResultProfiles',
    renderExport: (testResultProfiles) => (
        testResultProfiles.map(({ supported, ssgVersion }) =>(
            `${ !supported ? '!' : '' }${ ssgVersion }`
        )).join(', ')
    ),
    renderFunc: renderComponent(SsgVersionCell)
};

export const Policies = {
    title: 'Policies',
    exportKey: 'policies',
    renderExport: (policies) => (
        policies.map(({ name }) => (name)).join(', ')
    ),
    props: {
        width: 40,
        ...disableSorting
    },
    renderFunc: renderComponent(PoliciesCell)
};

export const DetailsLink = {
    title: '',
    export: false,
    props: {
        width: 20,
        ...disableSorting
    },
    renderFunc: renderComponent(DetailsLinkCell)
};

export const FailedRules = {
    title: 'Failed rules',
    exportKey: 'testResultProfiles',
    props: {
        width: 5,
        ...disableSorting
    },
    renderExport: (testResultProfiles) => (
        profilesRulesFailed(testResultProfiles).length
    ),
    renderFunc: renderComponent(FailedRulesCell)
};

export const ComplianceScore = {
    title: 'Compliance score',
    exportKey: 'testResultProfiles',
    props: {
        width: 5,
        ...disableSorting
    },
    renderExport: (testResultProfiles) => (
        complianceScoreString(complianceScoreData(testResultProfiles))
    ),
    renderFunc: renderComponent(ComplianceScoreCell)
};

export const LastScanned = {
    title: 'Last scanned',
    exportKey: 'testResultProfiles',
    props: {
        width: 10,
        ...disableSorting
    },
    renderExport: (testResultProfiles) => (
        lastScanned(testResultProfiles)
    ),
    renderFunc: renderComponent(LastScannedCell)
};

const operatingSystemString = ({ osMinorVersion, osMajorVersion }) => (
    `RHEL ${osMajorVersion}.${osMinorVersion}`
);

export const OperatingSystem  = {
    title: 'Operating system',
    props: disableSorting,
    renderExport: (cell) => (
        operatingSystemString(cell)
    ),
    renderFunc: (_data, _id, system) => (
        operatingSystemString(system)
    )
};
