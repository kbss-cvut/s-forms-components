import React, { useRef } from "react";
import SForms, { Constants } from "@kbss-cvut/s-forms";
import SmartComponents from "../SmartComponents";
import exampleForm from "./assets/example_form.json";
import exampleFormTC from "./assets/example_turisticky_cil.json";
import possibleValues from "./assets/possibleValues.json";
import { ComponentMeta, ComponentStory } from "@storybook/react";

const componentMapping = SmartComponents.getComponentMapping();

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

export default {
  title: "Stories/Forms",
  component: SForms,
} as ComponentMeta<typeof SForms>;

const Template: ComponentStory<typeof SForms> = (args) => {
  const refForm = useRef();

  const fetchTypeAheadValues = (query) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve(possibleValues), 1500)
    );
  };

  return (
    <SForms
      options={options}
      ref={refForm}
      form={exampleForm}
      fetchTypeAheadValues={fetchTypeAheadValues}
      componentMapRules={componentMapping}
      {...args}
    />
  );
};

export const Form1 = Template.bind({});
Form1.args = {
  options: options,
};
export const TouristDestination1 = Template.bind({});
TouristDestination1.args = {
  options: options,
  form: exampleFormTC,
};
