import React from "react";
import simpleTreeQuestion from "./assets/simple-single-tree-select.json";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import SmartComponents from "../s-forms-components";
import SForms, { Constants, IntlContextProvider } from "@kbss-cvut/s-forms";

import SimpleTreeTypeaheadAnswer from "../components/SimpleTreeTypeaheadAnswer";
import possibleValues from "./assets/possibleValues.json";

export default {
  title: "Components/Simple question with tree typeahead answer",
  component: SimpleTreeTypeaheadAnswer,
} as ComponentMeta<typeof SimpleTreeTypeaheadAnswer>;

const modalProps = {
  onHide: () => {},
  show: true,
  title: "Title",
};

const options = {
  i18n: {
    "wizard.next": "Next",
    "wizard.previous": "Previous",
    "section.expand": "Expand",
    "section.collapse": "Collapse",
  },
  intl: {
    locale: "cs",
  },
  modalView: false,
  modalProps,
  horizontalWizardNav: false,
  wizardStepButtons: true,
  enableForwardSkip: true,
  startingStep: 1,
  users: [
    { id: "http://fel.cvut.cz/people/max-chopart", label: "Max Chopart" },
    {
      id: "http://fel.cvut.cz/people/miroslav-blasko",
      label: "Miroslav Blasko",
    },
  ],
  currentUser: "http://fel.cvut.cz/people/max-chopart",
  icons: [
    {
      id: Constants.ICONS.QUESTION_HELP,
      behavior: Constants.ICON_BEHAVIOR.ENABLE,
    },
    {
      id: Constants.ICONS.QUESTION_COMMENTS,
      behavior: Constants.ICON_BEHAVIOR.ON_HOVER,
    },
    {
      id: Constants.ICONS.QUESTION_LINK,
      behavior: Constants.ICON_BEHAVIOR.ON_HOVER,
    },
  ],
};

const Template: ComponentStory<typeof SimpleTreeTypeaheadAnswer> = (args) => {
  const fetchTypeAheadValues = (query) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(possibleValues), 1500)
    );
  };

  return (
    <IntlContextProvider locale={options.intl.locale}>
      <SForms
        options={options}
        form={simpleTreeQuestion}
        fetchTypeAheadValues={fetchTypeAheadValues}
        componentMapRules={SmartComponents.getComponentMapping()}
      />
    </IntlContextProvider>
  );
};

export const SingleSelect = Template.bind({});
SingleSelect.args = {};
